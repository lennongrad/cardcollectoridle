import { Component, Input } from "@angular/core";
import { Discount, PackType } from "../interfaces";
import { CollectionService } from "../collection.service";
import { Beautify } from "../beautify";
import { ProductionService } from "../production.service";

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

  constructor(private collectionService: CollectionService, private productionService: ProductionService){
    //setTimeout(() => this.purchase( this.cardPacks![0], {amount: 76, discount: 1 }), 10)
  }

  getPrice(packType: PackType, discount?: Discount): string {
    return Beautify(this.collectionService.getPrice(packType, discount), 0)
  }

  canAfford(packType: PackType, discount?: Discount): boolean {
    return this.collectionService.getPrice(packType, discount) <= this.productionService.cash
  }

  purchase(packType: PackType, discount: Discount) {
    var price = this.collectionService.getPrice(packType, discount)

    if(price <= this.productionService.cash){
      this.productionService.cash -= price
      this.collectionService.buyPack(Array(discount.amount).fill(packType))
    }
  }
}
