import { Component, ElementRef } from '@angular/core';
import { ProductionService } from '../production.service';
import { ProductionDetail, ProductionOutput } from '../interfaces';
import { Beautify } from '../beautify';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrl: './production.component.less'
})
export class ProductionComponent {
  hideProduction = false;

  constructor(private productionService: ProductionService, private elRef: ElementRef){
    this.productionService.productionEmit.subscribe((productionOutput: ProductionOutput) => {
      this.onProductionEmit(productionOutput)
     });
  }

  getProductionDetails(): Array<ProductionDetail> {
    return this.productionService.getProductionDetails()
  }

  getProductionPurchaseable(productionDetail: ProductionDetail, index: number): boolean {
    if(index == 0){
      return true
    }

    var previousDetail = this.productionService.getProductionDetails()[index - 1]
    return this.productionService.getProductionLevel(previousDetail) >= 5
  }

  getProductionLevel(productionDetail: ProductionDetail): string {
    return String(this.productionService.getProductionLevel(productionDetail))
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

  getOverallLevel(): number {
    return this.productionService.getOverallLevel()
  }

  getCriticalRate(): number {
    return this.productionService.getCriticalRate() * 100
  }

  onProductionEmit(productionOutput: ProductionOutput) {
    var childElement = this.elRef.nativeElement.querySelector("#detail-" + productionOutput.index);

    this.productionService.emitBonus({
      x: childElement.getBoundingClientRect().x + 20,
      y: childElement.getBoundingClientRect().y + 20,
      timer: 200,
      value: "$" + productionOutput.value
    })
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
    this.productionService.levelUp(productionDetail, segment);
  }

  clickLevelDown(productionDetail: ProductionDetail, segment: string) {
    this.productionService.levelDown(productionDetail, segment);
    return false;
  }
}
