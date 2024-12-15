import { Component } from '@angular/core';
import { Achievement, Bonus } from '../interfaces';
import { ProductionService } from '../production.service';
import { interval } from 'rxjs';
import { Beautify } from '../beautify';
import { AchievementsService } from '../achievements.service';

interface AchievementDisplay {
  achievement: Achievement,
  timer: number
}

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.less'
})
export class BonusComponent {
  bonuses: Array<Bonus> = [];
  achievements: Array<AchievementDisplay> = []
  achievementBurner: number = 0;

  constructor(private productionService: ProductionService, private achievementService: AchievementsService){
    productionService.bonusEmit.subscribe((bonus: Bonus) => {
      this.addBonus(bonus)
    })

    this.achievementService.achievementEmit.subscribe((achievement: Achievement) => {
      this.addAchievement(achievement)
    })

    var timer = interval(1);
    timer.subscribe(() => {this.onCentisecond()})
  }

  addBonus(bonus: Bonus){
    bonus.x += (Math.random() * 20) - 10
    bonus.y += (Math.random() * 20) - 10
    this.bonuses.push(bonus)
  }

  addAchievement(achievement: Achievement) {
    var matchingAchievement = this.achievements.filter(
      originalAchievement => originalAchievement.achievement.achievementData.name == achievement.achievementData.name)
    
    if(matchingAchievement.length >= 1){
      matchingAchievement[0].timer = 1000
    } else {    
      this.achievements.unshift({
        achievement: achievement,
        timer: 1000 + this.achievementBurner
      })
      this.achievementBurner += 100
    }
  }

  removeAchievement(index: number) {
    this.achievements[index].timer = 50
    //this.achievements.splice(index, 1)
  }

  getValue(bonus: Bonus){
    return Beautify(bonus.value, 2)
  }

  onCentisecond(){
    this.bonuses.forEach(bonus => {
      bonus.timer -= 1
    })
    this.achievements.forEach(achievement => {
      achievement.timer -= 1
    })
    this.bonuses = this.bonuses.filter(bonus => bonus.timer > 0)
    this.achievements = this.achievements.filter(achievement => achievement.timer > 0)
    this.achievementBurner = Math.max(0, this.achievementBurner - 1)
  }

  getBonusStyle(bonus: Bonus): any {
    return {
      "left": bonus.x + "px",
      "top": bonus.y + "px"
    }
  }

  getAchievementStyle(achievement: AchievementDisplay): any {
    if(achievement.timer > 100){
      return {}
    }
    return {
      "transform": `scale(${0.5 + 0.5 * achievement.timer / 100}, ${achievement.timer / 100}) translateY(${achievement.timer / 100 * 5}px)`,
      "margin-top": `-${90 * (1 - achievement.timer / 100)}px`
    }
  }
}
