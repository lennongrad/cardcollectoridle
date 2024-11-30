import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Beautify } from './beautify';
import { Bonus, Position, ProductionDetail, ProductionType, SavedProductionDetail } from './interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  cash: number = 0;
  public bonusEmit: Subject<Bonus> = new Subject(); 

  productionDetails: Array<ProductionDetail> = [];

  loadProductionDetails(
    productionTypes: Array<ProductionType>, 
    savedProductionDetails: Map<number, SavedProductionDetail>){
      productionTypes.forEach((productionType: ProductionType) => {
        var loadedProductionDetail = savedProductionDetails.get(productionType.id)
        this.productionDetails.push({
          productionType: productionType,
          currentProgress: loadedProductionDetail?.currentProgress!,
          levelClick: loadedProductionDetail?.levelClick!,
          levelTime: loadedProductionDetail?.levelTime!,
          levelValue: loadedProductionDetail?.levelValue!
        })
    })
  }

  getProductionDetails(): Array<ProductionDetail> {
    return this.productionDetails
  }

  getMaxProgress(productionDetail: ProductionDetail): number {
    return 100;
  }

  getProductionExp(productionDetail: ProductionDetail, segment: string): number {
    var relevantLevel = 0;
    switch(segment){
      case "click": relevantLevel = productionDetail.levelClick; break;
      case "time": relevantLevel = productionDetail.levelTime; break;
      case "value": relevantLevel = productionDetail.levelValue; break;
    }
    
    return Math.pow(
      productionDetail.productionType.power + 2, 
      relevantLevel + 2
    )
  }
  
  getProductionEfficiency(productionDetail: ProductionDetail): number {
    return productionDetail.levelValue 
  }

  getProductionValue(productionDetail: ProductionDetail): number {
    return Math.pow(productionDetail.productionType.power, 2) * this.getProductionEfficiency(productionDetail)
  }

  getCashAmount(): string{
    return Beautify(this.cash, 0);
  }

  clickButton(position: Position) {
    var amount = Math.floor(Math.random() * 15) 
    this.cash += amount;

    this.bonusEmit.next({
      x: position.x,
      y: position.y,
      timer: 200,
      value: "+$" + String(amount)
    });
  }
  
  constructor(){
    // placeholder
    var productionTypes: Array<ProductionType> = [
      { id: 0, title: "Local Tournaments", icon: "", power: 1 },
      { id: 1, title: "Card Trading", icon: "", power: 3 },
      { id: 2, title: "Write Articles", icon: "", power: 5 },
      { id: 3, title: "Regional Tournaments", icon: "", power: 6 },
      { id: 4, title: "Manage Store", icon: "", power: 9 },
      { id: 5, title: "Record Videos", icon: "", power: 11 },
      { id: 6, title: "Global Tournaments", icon: "", power: 12 },
    ]

    // placeholder
    var savedProductionDetails = new Map<number, SavedProductionDetail>([
      [ 0, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 1, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 2, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 3, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 4, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 5, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
      [ 6, { currentProgress: 0, levelClick: 0, levelTime: 0, levelValue: 1 } ],
    ])

    this.loadProductionDetails(productionTypes, savedProductionDetails)
  }
}
