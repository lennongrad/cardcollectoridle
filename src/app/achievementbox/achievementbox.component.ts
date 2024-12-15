import { Component, Input } from '@angular/core';
import { Achievement } from '../interfaces';
import { AchievementsService } from '../achievements.service';
import { Beautify } from '../beautify';

interface AchievementRelevance {
  name: string,
  type: "Trigger" | "Goal"
}

@Component({
  selector: 'app-achievementbox',
  templateUrl: './achievementbox.component.html',
  styleUrl: './achievementbox.component.less'
})
export class AchievementboxComponent {
  @Input() achievement?: Achievement;

  getRelevant(achievement: Achievement): AchievementRelevance {
    if(Object.keys(achievement.achievementData.completionGoals).length >= 1){
      return { name: Object.keys(achievement.achievementData.completionGoals)[0], type: "Goal" }
    } 
    return { name: Object.keys(achievement.achievementData.completionTriggers)[0], type: "Trigger" }
  }

  getMax(achievement: Achievement): number {
    var relevance = this.getRelevant(achievement)

    if(relevance.type == "Goal") {
      return achievement.achievementData.completionGoals[relevance.name]
    }

    if(relevance.type == "Trigger") {
      return achievement.achievementData.completionTriggers[relevance.name]
    }
    return 1
  }

  getValue(achievement: Achievement): number {
    var relevance = this.getRelevant(achievement)

    if(relevance.type == "Goal") {
      if(Object.keys(this.achievementsService.completedGoals).includes(relevance.name)){
        return this.achievementsService.completedGoals[relevance.name]
      }
      return 0
    }

    if(relevance.type == "Trigger") {
      if(Object.keys(achievement.seenTriggers).includes(relevance.name)){
        return achievement.seenTriggers[relevance.name]
      }
      return 0
    }
    return 1
  }
  
  Beautify(n: number): string{
    return Beautify(n, 0)
  }

  constructor(private achievementsService: AchievementsService) {}
}
