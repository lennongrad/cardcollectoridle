import { Injectable } from '@angular/core';
import { Achievement, SavedAchievement, Trigger } from './interfaces';
import { achievementData } from './data';
import { interval, Subject } from 'rxjs';
import { ProductionService } from './production.service';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  skipSaving = false;
  achievements: Array<Achievement> = [];

  constructor(
    private productionService: ProductionService,
    private collectionService: CollectionService
  ) {    
    var savedAchievementDetails: Array<SavedAchievement> = []
    var potentialAchievementDetails = localStorage.getItem("savedAchievements")
    if(potentialAchievementDetails != null && potentialAchievementDetails != ""){
      savedAchievementDetails = JSON.parse(potentialAchievementDetails)
    }

    achievementData.forEach(achievementDetail => {
      var matchingLoadedData = savedAchievementDetails.filter(achievement => achievement.achievementDataID == achievementDetail.id)
    
      if(matchingLoadedData.length == 1){
        this.achievements.push({
          achievementData: achievementDetail,
          seenTriggers: matchingLoadedData[0].seenTriggers,
          completed: matchingLoadedData[0].completed
        })
      } else {
        this.achievements.push({
          achievementData: achievementDetail,
          seenTriggers: {},
          completed: false
        })
      }
    })

    console.log(this.achievements)
        
    var timer = interval(1000);
    timer.subscribe(() => {this.progressAchievements()})

    this.productionService.triggerEmit.subscribe(this.registerTrigger.bind(this))
    this.collectionService.triggerEmit.subscribe(this.registerTrigger.bind(this))
  }

  progressAchievements(currentTrigger?: string){
    var completedAchievements: Array<Achievement> = []
    var completedGoals: Record<string, number> = {}

    this.productionService.addGoals(completedGoals)
    this.collectionService.addGoals(completedGoals)

    this.achievements.filter(achievement => !achievement.completed).forEach(activeAchievement => {
      var triggersFulfilled = Object.keys(activeAchievement.achievementData.completionTriggers).every(trigger => {
        return Object.keys(activeAchievement.seenTriggers).includes(trigger) && activeAchievement.seenTriggers[trigger] >= activeAchievement.achievementData.completionTriggers[trigger]
      })
      var goalsFulfilled = Object.keys(activeAchievement.achievementData.completionGoals).every(goal => {
        return Object.keys(completedGoals).includes(goal) && completedGoals[goal] >= activeAchievement.achievementData.completionGoals[goal] 
      })

      if(triggersFulfilled && goalsFulfilled){
        completedAchievements.push(activeAchievement)
        activeAchievement.completed = true
        console.log(activeAchievement)
      }
    })

    completedAchievements.forEach(achievement => this.productionService.earnAchievement(achievement))

    if(completedAchievements.length != 0){
      this.saveAchievements()
    }
  }

  saveAchievements() {
    if(this.skipSaving){
      return;
    }

    var savedAchievements: Array<SavedAchievement> = []
    this.achievements.forEach((achievement: Achievement) => {
      savedAchievements.push({
        achievementDataID: achievement.achievementData.id,
        seenTriggers: achievement.seenTriggers,
        completed: achievement.completed
      })
    })

    localStorage.setItem("savedAchievements", JSON.stringify(savedAchievements));
  }

  resetSave() {
    localStorage.setItem("savedAchievements", "");
    this.skipSaving = true;
  }

  registerTrigger(trigger: Trigger){
    console.log("Registered trigger: " + trigger.type)
    
    this.achievements.filter(achievement => !achievement.completed).forEach(activeAchievement => {
      if(!Object.keys(activeAchievement.achievementData.completionTriggers).includes(trigger.type)){
        return
      }
      
      if(!Object.keys(activeAchievement.seenTriggers).includes(trigger.type)){
        activeAchievement.seenTriggers[trigger.type] = 0
      }
      activeAchievement.seenTriggers[trigger.type] += trigger.amount
    })

    this.progressAchievements()
  }
}
