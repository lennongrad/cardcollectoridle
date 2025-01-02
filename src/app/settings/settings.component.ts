import { Component } from '@angular/core';
import { AchievementsService } from '../achievements.service';
import { CollectionService } from '../collection.service';
import { ProductionService } from '../production.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.less'
})
export class SettingsComponent {
  constructor(
    private productionService: ProductionService,
    private collectionService: CollectionService,
    private achievementService: AchievementsService) {}

  reset() {
    this.productionService.resetSave();  
    this.collectionService.resetSave(); 
    this.achievementService.resetSave();
    location.reload(); 
  }
}
