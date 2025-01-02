import { Component } from '@angular/core';
import { CollectionService } from '../collection.service';
import { CardDetail, CardSet, CardSetDetail } from '../interfaces';
import { Beautify } from '../beautify';

@Component({
  selector: 'app-binder',
  templateUrl: './binder.component.html',
  styleUrl: './binder.component.less'
})
export class BinderComponent {
  constructor(private collectionService: CollectionService) { }

  getBurnerCount(): Array<null> {
    var cardsPerRow = Math.max(3, Math.floor((window.innerWidth - 371) / 210))
    var neededBurners = cardsPerRow - (this.getActiveCardSet()!.cards.length % cardsPerRow)
    
    return Array(neededBurners)
  }

  getActiveCardSet(): CardSetDetail | undefined {
    return this.collectionService.activeCardSet
  }

  getCardSets(): Array<CardSetDetail> {
    return this.collectionService.cardSets
  }

  getPrice(card: CardDetail): string {
    return Beautify(100000, 0)
  }

  clickCard(card: CardDetail) {
    this.collectionService.acquireCard(card, 1, 0)
  }

  rightClickCard(card: CardDetail): false {
    this.collectionService.acquireCard(card, 0, 1)
    return false;
  }

  t() {
    /*console.log(this.collectionService.buyPack([{
      set: this.activeCardSet!,
      cardCount: 6,
      foilBoost: 0,
      t
    }]))*/
  }
}
