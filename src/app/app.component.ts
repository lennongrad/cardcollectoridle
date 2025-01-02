import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ProductionService } from './production.service';
import { WindowService } from './window.service';
import { WindowType } from './interfaces';
import { CollectionService } from './collection.service';
import { AchievementsService } from './achievements.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  constructor(
    private productionService: ProductionService,
    private collectionService: CollectionService,
    private achievementService: AchievementsService,
    private windowService: WindowService){
      if(this.collectionService.cardSets.length == 0){
        collectionService.cardSetsLoaded.subscribe(() => {
          this.collectionService.activeCardSet = this.collectionService.cardSets[0]
        })
      } else {
        this.collectionService.activeCardSet = this.collectionService.cardSets[0]
      }
    }

  getActiveWindow(): WindowType {
    return this.windowService.getActiveWindow()
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowService.onResize(event.target.innerWidth)
  }
    
  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    switch(event.key){
      case "e": this.productionService.exp += 1000; break;
      case "c": this.productionService.cash += 100; break;
      case "r": 
        this.productionService.resetSave();  
        this.collectionService.resetSave(); 
        this.achievementService.resetSave();
        location.reload(); 
        break;
    }
  }
}