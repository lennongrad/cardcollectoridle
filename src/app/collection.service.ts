import { Injectable } from '@angular/core';
import { DataManageService } from './data-manage.service';
import { CardDetail, CardPackCard, CardRarity, CardSet, CardSetDetail, CardType, PackType, SavedCardDetail, SavedSetDetail } from './interfaces';
import { Subject, Subscription } from 'rxjs';
import { randomItem } from './helpers';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  cardSets: Array<CardSetDetail> = []
  skipSaving: boolean = false;
  
  public cardSetsLoaded: Subject<null> = new Subject();

  constructor(private dataManageService: DataManageService) {
    var savedCardDetails: Array<SavedCardDetail> = []
    var potentialCardDetails = localStorage.getItem("cardDetails")
    if(potentialCardDetails != null && potentialCardDetails != ""){
      savedCardDetails = JSON.parse(potentialCardDetails)
    }

    this.dataManageService.beginParsingCards().subscribe(
      (loadedCardSets: Array<CardSet>) => {
        this.loadCardDetails(loadedCardSets, savedCardDetails)
      }
    )
  } 

  getFoilChance(cardDetail: CardDetail, foilMod: number = 0, foilOverride: number = -1): number {
    return 0.2 * Math.pow(0.9, foilOverride == -1 ? cardDetail.foilCount : foilOverride - foilMod)
  }

  generatePack(packs: Array<PackType>): Array<CardPackCard> {
    var cards = new Map<string, CardPackCard>();

    packs.forEach((pack: PackType) => {
      var packCards: Array<string> = []

      for(var e_ = 0; e_ < pack.cardCount; e_++){
        var card: CardDetail

        var chosenRarity: CardRarity = "Common"
        var rarityRoll = Math.random()
        if(rarityRoll < .05){
          chosenRarity = "Mystic"
        } else if (rarityRoll < .15) {
          chosenRarity = "Rare"
        } else if (rarityRoll < .35) {
          chosenRarity = "Uncommon"
        }

        do {
          card = randomItem(pack.set.byRarity[chosenRarity])
        } while (packCards.includes(card.cardType.id))

        packCards.push(card.cardType.id)

        var isFoil = Math.random() < this.getFoilChance(card, pack.foilBoost)
        
        if(!cards.has(card.cardType.id)){
          cards.set(card.cardType.id, {
            "card": card,
            "count": 0,
            "foilCount": 0
          })
        }

        if(!isFoil) {
          cards.get(card.cardType.id)!.count += 1
        } else {
          cards.get(card.cardType.id)!.foilCount += 1
        }
      }
    })

    return Array.from(cards.values());
  }

  buyPack(packs: Array<PackType>) {
    var cards: Array<CardPackCard> = this.generatePack(packs)

    cards.forEach((card: CardPackCard) => {
      this.acquireCard(card.card, card.count, card.foilCount)
    })
  }

  acquireCard(card: CardDetail, count: number = 1, foilCount: number = 0) {
    card.count += count
    card.maxCount = Math.max(card.count, card.maxCount)
    card.foilCount += foilCount
    card.maxFoilCount = Math.max(card.foilCount, card.maxFoilCount)
    this.saveCardDetails()
  }
  
  saveCardDetails() {
    if(this.skipSaving){
      return;
    }

    var savedSetDetails: Array<SavedSetDetail> = []
    var savedCardDetails: Array<SavedCardDetail> = []

    this.cardSets.forEach((cardSetDetail: CardSetDetail) => {
      cardSetDetail.cards.forEach((cardDetail: CardDetail) => {
        savedCardDetails.push({
          id: cardDetail.cardType.id,
          count: cardDetail.count,
          foilCount: cardDetail.foilCount,
          maxCount: cardDetail.maxCount,
          maxFoilCount: cardDetail.maxFoilCount
        })
      })
    })

    localStorage.setItem("setDetails", JSON.stringify(savedSetDetails));
    localStorage.setItem("cardDetails", JSON.stringify(savedCardDetails));
  } 

  resetSave() {
    localStorage.setItem("setDetails", "");
    localStorage.setItem("cardDetails", "");
    this.skipSaving = true
  }

  loadCardDetails(
    loadedCardSets: Array<CardSet>, 
    savedCardDetails: Array<SavedCardDetail>){
      var cardDetailMap = new Map<String, SavedCardDetail>()
      savedCardDetails.forEach((savedCardDetail: SavedCardDetail) => {
        cardDetailMap.set(savedCardDetail.id, savedCardDetail)
      })

      loadedCardSets.forEach((cardSet: CardSet) => {
        var cardDetails: Array<CardDetail> = []
        var byRarity: Record<CardRarity, Array<CardDetail>> = {
          "Common": [], "Uncommon": [], "Rare": [], "Mystic": []
        }

        cardSet.cards.forEach((cardType: CardType) => {
          var relevantDetails: SavedCardDetail | undefined = cardDetailMap.get(cardType.id)

          var cardDetail: CardDetail = {
            cardType: cardType,
            count: 0,
            foilCount: 0,
            maxCount: 0,
            maxFoilCount: 0
          }
          if(relevantDetails != undefined){
            cardDetail = {
              cardType: cardType,
              count: relevantDetails.count,
              foilCount: relevantDetails.foilCount,
              maxCount: relevantDetails.maxCount,
              maxFoilCount: relevantDetails.maxFoilCount
            }
          }
          cardDetails.push(cardDetail)
          byRarity[cardType.rarity].push(cardDetail)
        })
        
        this.cardSets.push({
          cardSet: cardSet,
          cards: cardDetails, 
          byRarity: byRarity
        })        
      })

      this.cardSetsLoaded.next(null);
  }
}
