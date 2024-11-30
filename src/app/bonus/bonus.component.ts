import { Component } from '@angular/core';
import { Bonus } from '../interfaces';
import { ProductionService } from '../production.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.less'
})
export class BonusComponent {
  bonuses: Array<Bonus> = [];

  constructor(private productionService: ProductionService){
    productionService.bonusEmit.subscribe((bonus: Bonus) => {
      this.addBonus(bonus)
    })

    var timer = interval(1);
    timer.subscribe(() => {this.onCentisecond()})
  }

  addBonus(bonus: Bonus){
    bonus.x += (Math.random() * 20) - 10
    bonus.y += (Math.random() * 20) - 10
    this.bonuses.push(bonus)
  }

  onCentisecond(){
    this.bonuses.forEach(bonus => {
      bonus.timer -= 1
    })
    this.bonuses = this.bonuses.filter(bonus => bonus.timer > 0)
  }

  getBonusStyle(bonus: Bonus): any{
    return {
      "left": bonus.x + "px",
      "top": bonus.y + "px"
    }
  }
}
