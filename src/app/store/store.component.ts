import { Component, Input } from "@angular/core";
import { PackType } from "../interfaces";
import { CollectionService } from "../collection.service";
import { Beautify } from "../beautify";


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.less'
})
export class StoreComponent  {
  @Input() cardPacks?: Array<PackType>

  constructor(private collectionService: CollectionService){}

  getPrice(packType: PackType): string {
    return Beautify(packType.baseCost, 0)
  }
}
