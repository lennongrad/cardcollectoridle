import { Component } from '@angular/core';
import { AchievementsService } from '../achievements.service';
import { Achievement } from '../interfaces';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.less'
})
export class AchievementsComponent {
  holderWidth = 50

  constructor(private achievementsService: AchievementsService) {}

  getAchievements() : Array<Achievement> {
    return this.achievementsService.achievements
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
