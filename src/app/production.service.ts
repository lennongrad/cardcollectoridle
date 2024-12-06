import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Beautify } from './beautify';
import { Bonus, Position, ProductionDetail, ProductionOutput, ProductionType, SavedProductionDetail } from './interfaces';
import { interval, Subject } from 'rxjs';
import { DataManageService } from './data-manage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  cash: number = 0;
  exp: number = 0;

  skipSaving = false;

  public bonusEmit: Subject<Bonus> = new Subject(); 
  public productionEmit: Subject<ProductionOutput> = new Subject();

  productionDetails: Array<ProductionDetail> = [];
  
  constructor(private dataManageService: DataManageService){
    var savedProductionDetails: Array<SavedProductionDetail> = []
    var potentialProductionDetails = localStorage.getItem("productionDetails")
    if(potentialProductionDetails != null && potentialProductionDetails != ""){
      savedProductionDetails = JSON.parse(potentialProductionDetails)
    }

    var potentialCash = localStorage.getItem("cash")
    if(potentialCash != null && potentialCash != ""){
      this.cash = Number(potentialCash)
    }
    var potentialExp = localStorage.getItem("exp")
    if(potentialExp != null && potentialExp != ""){
      this.exp = Number(potentialExp)
    }

    this.dataManageService.beginParsingProduction().subscribe(
      (loadedProductionTypes: Array<ProductionType>) => {
        this.loadProductionDetails(loadedProductionTypes, savedProductionDetails)
      }
    )
    
    var timer = interval(1);
    timer.subscribe(() => {this.onCentisecond()})
  }

  onCentisecond() {
    this.productionDetails.forEach((productionDetail: ProductionDetail) => {
      var variance = 1.1 - (0.2 * Math.random())
      productionDetail.currentProgress += productionDetail.levelTime / 100 * variance
    })
    this.updateProgress()
  }

  loadProductionDetails(
    productionTypes: Array<ProductionType>, 
    savedProductionDetails: Array<SavedProductionDetail>){
      productionTypes.forEach((productionType: ProductionType) => {
        var loadedProductionDetail = savedProductionDetails[productionType.id]
        if(loadedProductionDetail == null){
          loadedProductionDetail = {
            currentProgress: 0, 
            levelClick: 0,
            levelTime: 0,
            levelValue: 1
          }
        }

        this.productionDetails.push({
          productionType: productionType,
          currentProgress: loadedProductionDetail?.currentProgress!,
          levelClick: loadedProductionDetail?.levelClick!,
          levelTime: loadedProductionDetail?.levelTime!,
          levelValue: loadedProductionDetail?.levelValue!
        })
    })
  }
  
  saveProductionDetails() {
    if(this.skipSaving){
      return;
    }

    var savedProductionDetails: Array<SavedProductionDetail> = []
    this.productionDetails.forEach((productionDetail: ProductionDetail) => {
      savedProductionDetails.push(productionDetail)
    })

    localStorage.setItem("productionDetails", JSON.stringify(savedProductionDetails));
    localStorage.setItem("cash", String(this.cash))
    localStorage.setItem("exp", String(this.exp))
  }

  resetSave() {
    localStorage.setItem("productionDetails", "");
    localStorage.setItem("cash", "");
    localStorage.setItem("exp", "");
    this.skipSaving = true;
  }

  getProductionDetails(): Array<ProductionDetail> {
    return this.productionDetails
  }

  getMaxProgress(productionDetail: ProductionDetail): number {
    return 100;
  }

  getProductionExp(productionDetail: ProductionDetail, segment: string, level: number = -1): number {
    var relevantLevel = level;

    if(level == -1){
      switch(segment){
        case "click": relevantLevel = productionDetail.levelClick; break;
        case "time": relevantLevel = productionDetail.levelTime; break;
        case "value": relevantLevel = productionDetail.levelValue; break;
      }
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
    return Math.pow(productionDetail.productionType.power, 2) * 10 * this.getProductionEfficiency(productionDetail)
  }

  getCashAmount(): string {
    return Beautify(this.cash, 0);
  }

  getExpAmount(): string {
    return Beautify(this.exp, 0);
  }
  
  getCriticalRate(): number {
    return 0.2
  }

  getProductionLevel(productionDetail: ProductionDetail): number {
    return productionDetail.levelClick + productionDetail.levelTime + productionDetail.levelValue
  }

  getOverallLevel(): number {
    return this.productionDetails.reduce((acc: number, productionDetail: ProductionDetail) => {
      return acc + this.getProductionLevel(productionDetail) - 1
    }, 0) + 1
  }

  levelUp(productionDetail: ProductionDetail, segment: string) {
    var necessaryExp = this.getProductionExp(productionDetail, segment);
    if(this.exp < necessaryExp){
      return;
    }

    this.exp -= necessaryExp;
    switch(segment){
      case "click": productionDetail.levelClick += 1; break;
      case "time": productionDetail.levelTime += 1; break;
      case "value": productionDetail.levelValue += 1; break;
    }
  }

  levelDown(productionDetail: ProductionDetail, segment: string) {
    var relevantLevel = 0;
    switch(segment){
      case "click": relevantLevel = productionDetail.levelClick; break;
      case "time": relevantLevel = productionDetail.levelTime; break;
      case "value": relevantLevel = productionDetail.levelValue; break;
    }
    relevantLevel -= 1;

    if(relevantLevel >= 1 || (relevantLevel >= 0 && segment != "value")){
      switch(segment){
        case "click": productionDetail.levelClick -= 1; break;
        case "time": productionDetail.levelTime -= 1; break;
        case "value": productionDetail.levelValue -= 1; break;
      }

      var receivedExp = this.getProductionExp(productionDetail, segment)
      this.exp += receivedExp * .8
    }
  }

  emitBonus(bonus: Bonus) {
    this.bonusEmit.next(bonus);
  }

  clickButton(position: Position) {
    var isCritical = Math.random() < this.getCriticalRate()
    var amount = (isCritical ? 2 : 1) * this.getOverallLevel()

    this.cash += amount;

    this.emitBonus({
      x: position.x,
      y: position.y,
      timer: 200,
      value: "+$" + String(amount)
    });

    this.productionDetails.forEach((productionDetail: ProductionDetail) => {
      productionDetail.currentProgress += productionDetail.levelClick * (isCritical ? 2 : 1)
    })

    this.updateProgress()
  }

  updateProgress() {
    this.productionDetails.forEach((productionDetail: ProductionDetail, index: number) => {
      while(productionDetail.currentProgress > this.getMaxProgress(productionDetail)){
        productionDetail.currentProgress -= this.getMaxProgress(productionDetail)

        var finalValue = this.getProductionValue(productionDetail)
        this.cash += finalValue
        this.productionEmit.next({index: index, value: finalValue})
      }
    })
    this.saveProductionDetails()
  }
} 