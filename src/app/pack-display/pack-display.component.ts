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
  clickedCards: Array<boolean> = []

  constructor(collectionService: CollectionService) {
    collectionService.packOpened.subscribe((cards: Array<CardPackCard>) => {
      this.packContents = cards
      this.clickedCards = Array(cards.length).fill(false)
    })
  }

  openAll() {
    for(var i = 0; i < this.clickedCards.length; i++){
      this.clickedCards[i] = true
    }
  }

  getBurnerCount(): Array<null> {
    var cardsPerRow = Math.max(3, Math.floor((window.innerWidth * .8) / 210))
    var neededBurners = cardsPerRow - (this.packContents!.length % cardsPerRow)
    
    return Array(neededBurners)
  }
}
