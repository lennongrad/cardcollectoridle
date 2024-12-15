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
  completedGoals: Record<string, number> = {}

  public achievementEmit = new Subject<Achievement>();

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
          completed: matchingLoadedData[0].completed,
          pinned: matchingLoadedData[0].pinned,
          lastRelevantGoal: -1
        })
      } else {
        this.achievements.push({
          achievementData: achievementDetail,
          seenTriggers: {},
          completed: false,
          pinned: false,
          lastRelevantGoal: -1
        })
      }
    })

    console.log(this.achievements)
        
    var timer = interval(1000);
    timer.subscribe(() => {this.progressAchievements()})
    
    // for testing
    /*setTimeout(() => this.achievementEmit.next(this.achievements[0]), 100)
    setTimeout(() => this.achievementEmit.next(this.achievements[1]), 400)
    setTimeout(() => this.achievementEmit.next(this.achievements[2]), 600)
    setTimeout(() => this.achievementEmit.next(this.achievements[69]), 800)*/

    this.productionService.triggerEmit.subscribe(this.registerTrigger.bind(this))
    this.collectionService.triggerEmit.subscribe(this.registerTrigger.bind(this))
  }

  progressAchievements(currentTrigger?: string){
    var forceSave = false
    var completedAchievements: Array<Achievement> = []
    this.completedGoals = {}

    this.productionService.addGoals(this.completedGoals)
    this.collectionService.addGoals(this.completedGoals)

    this.achievements.filter(achievement => !achievement.completed).forEach(activeAchievement => {
      var triggersFulfilled = Object.keys(activeAchievement.achievementData.completionTriggers).every(trigger => {
        return Object.keys(activeAchievement.seenTriggers).includes(trigger) && activeAchievement.seenTriggers[trigger] >= activeAchievement.achievementData.completionTriggers[trigger]
      })
      var goalsFulfilled = Object.keys(activeAchievement.achievementData.completionGoals).every(goal => {
        return Object.keys(this.completedGoals).includes(goal) && this.completedGoals[goal] >= activeAchievement.achievementData.completionGoals[goal] 
      })

      if(!goalsFulfilled){
        var relevantGoal = Object.keys(activeAchievement.achievementData.completionGoals)[0]
        
        if(activeAchievement.lastRelevantGoal != this.completedGoals[relevantGoal]){
          if(activeAchievement.pinned && activeAchievement.lastRelevantGoal != -1){
            this.achievementEmit.next(activeAchievement)
          }        
          activeAchievement.lastRelevantGoal = this.completedGoals[relevantGoal]
        }
      }

      if(triggersFulfilled && goalsFulfilled){
        completedAchievements.push(activeAchievement)
        activeAchievement.completed = true
        console.log(activeAchievement)
      }
    })

    this.achievements.filter(achievement => achievement.completed).forEach(achievement => {
      if(achievement.pinned){
        achievement.pinned = false
        forceSave = true
      }      
    })

    completedAchievements.forEach(achievement => {
      this.productionService.earnAchievement(achievement)
      this.achievementEmit.next(achievement)
    })

    if(completedAchievements.length != 0 || forceSave){
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
        completed: achievement.completed,
        pinned: achievement.pinned
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

      if(activeAchievement.pinned){
        this.achievementEmit.next(activeAchievement)
      }
    })

    this.progressAchievements()
  }
}
