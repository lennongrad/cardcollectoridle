import { Component } from '@angular/core';
import { AchievementsService } from '../achievements.service';
import { Achievement } from '../interfaces';
import { ProductionService } from '../production.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.less'
})
export class AchievementsComponent {
  holderWidth = 50
  lastHoveredAchievement ?: Achievement;

  constructor(
    private achievementsService: AchievementsService,
    private productionService: ProductionService) {}

  getStars(): number {
    return this.productionService.stars
  }

  getLevel(): number {
    return this.productionService.level
  }

  getAchievements() : Array<Achievement> {
    return this.achievementsService.achievements
  }

  rightClickAchievement(achievement: Achievement): false {
    achievement.pinned = !achievement.pinned; 
    this.achievementsService.saveAchievements()
    return false
  }

  getParity(i: number): boolean {
    var boxWidth: number = Math.floor((window.innerWidth - 372 - this.holderWidth) / 80)
    return (i % boxWidth + Math.floor(i / boxWidth)) % 2 == 0
  }

  getWidth(): number {
    var boxWidth = window.innerWidth - 372 - this.holderWidth
    return boxWidth - boxWidth % 80
  }
}
