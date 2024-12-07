import { Component, Input } from '@angular/core';
import { CardPackCard } from '../interfaces';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-pack-display',
  templateUrl: './pack-display.component.html',
  styleUrl: './pack-display.component.less'
})
export class PackDisplayComponent {
  packContents?: Array<CardPackCard>

  constructor(collectionService: CollectionService) {
    collectionService.packOpened.subscribe((cards: Array<CardPackCard>) => {
      this.packContents = cards
    })
  }
}
