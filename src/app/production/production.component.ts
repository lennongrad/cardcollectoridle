import { Component } from '@angular/core';
import { ProductionService } from '../production.service';
import { ProductionDetail } from '../interfaces';
import { Beautify } from '../beautify';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrl: './production.component.less'
})
export class ProductionComponent {
  constructor(private productionService: ProductionService){}

  getProductionDetails(): Array<ProductionDetail>{
    return this.productionService.getProductionDetails()
  }

  getProductionLevel(productionDetail: ProductionDetail): string {
    return "Lvl." + (productionDetail.levelClick + productionDetail.levelTime + productionDetail.levelValue)
  }

  getProductionValuePercentage(productionDetail: ProductionDetail): string {
    return String(this.productionService.getProductionEfficiency(productionDetail)).slice(0, 3)
  }

  getProductionProgressPercentage(productionDetail: ProductionDetail): number {
    return productionDetail.currentProgress / this.productionService.getMaxProgress(productionDetail)
  }

  getProductionExp(productionDetail: ProductionDetail, segment: string): string {
    return Beautify(this.productionService.getProductionExp(productionDetail, segment), 0)
  }

  getProductionValue(productionDetail: ProductionDetail): string {
    return Beautify(this.productionService.getProductionValue(productionDetail), 0)
  }

  getProductionProgressStyle(productionDetail: ProductionDetail): any {
    var percentageValue: string = this.getProductionProgressPercentage(productionDetail) * 100 + "%"
    return {
      "background": `linear-gradient(to right, #155066, #155066 ${percentageValue}, #041014 ${percentageValue}, #041014)`
    }
  }

  clickButton(e: MouseEvent){
    this.productionService.clickButton({
      x: e.clientX,
      y: e.clientY
    });
  }

  clickHeader(productionDetail: ProductionDetail) {
    productionDetail.currentProgress += 1
  }

  clickLevelUp(productionDetail: ProductionDetail, segment: string) {
    switch(segment){
      case "click": productionDetail.levelClick += 1; break;
      case "time": productionDetail.levelTime += 1; break;
      case "value": productionDetail.levelValue += 1; break;
    }
  }
}
