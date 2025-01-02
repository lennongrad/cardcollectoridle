import { Component } from '@angular/core';
import { CardSet, CardSetDetail } from '../interfaces';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-setchooser',
  templateUrl: './setchooser.component.html',
  styleUrl: './setchooser.component.less'
})
export class SetchooserComponent {
  constructor(private collectionService: CollectionService){}

  setActiveCardSet(newSet: CardSetDetail) {
    this.collectionService.activeCardSet = newSet
  }

  getActiveCardSet(): CardSetDetail | undefined { 
    return this.collectionService.activeCardSet
  }

  getCardSets(): Array<CardSetDetail> {
    return this.collectionService.cardSets
  }
}
