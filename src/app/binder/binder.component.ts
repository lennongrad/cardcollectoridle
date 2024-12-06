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
  activeCardSet?: CardSetDetail;

  constructor(private collectionService: CollectionService) {
    collectionService.cardSetsLoaded.subscribe(() => {
      this.activeCardSet = this.collectionService.cardSets[0]
    })
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
    console.log(this.collectionService.buyPack([{
      set: this.activeCardSet!,
      cardCount: 6,
      foilBoost: 0
    }]))
  }
}
