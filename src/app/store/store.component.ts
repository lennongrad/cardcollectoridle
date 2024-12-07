import { Component, Input } from "@angular/core";
import { PackType } from "../interfaces";
import { CollectionService } from "../collection.service";
import { Beautify } from "../beautify";

interface Discount {
  amount: number,
  discount: number
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.less'
})
export class StoreComponent  {
  @Input() cardPacks?: Array<PackType>

  chosenPackID: number = 0

  discounts: Array<Discount> = [
    { amount: 1, discount: 0 },
    { amount: 5, discount: 0.05 },
    { amount: 25, discount: 0.1 },
    { amount: 100, discount: 0.2 },
  ]

  constructor(private collectionService: CollectionService){}

  getPrice(packType: PackType, discount?: Discount): string {
    var realPrice = packType.baseCost

    if(discount != undefined){
      realPrice *= (1 - discount.discount) * discount.amount
    }

    return Beautify(realPrice, 0)
  }

  purchase(packType: PackType, discount: Discount) {
    this.collectionService.buyPack(Array(discount.amount).fill(packType))
  }
}
