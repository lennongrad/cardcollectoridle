import { Injectable } from '@angular/core';
import { DataManageService } from './data-manage.service';
import { CardDetail, CardPackCard, CardRarity, CardSet, CardSetDetail, CardType, Discount, PackType, SavedCardDetail, SavedSetDetail, Trigger } from './interfaces';
import { Subject } from 'rxjs';
import { randomItem } from './helpers';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  cardSets: Array<CardSetDetail> = []
  skipSaving: boolean = false;
  activeCardSet?: CardSetDetail;
  
  public cardSetsLoaded = new Subject()
  public triggerEmit: Subject<Trigger> = new Subject()
  public packOpened = new Subject<Array<CardPackCard>>()

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
    return 0.05 * Math.pow(0.95, foilOverride == -1 ? cardDetail.foilCount : foilOverride - foilMod)
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

    this.packOpened.next(cards)
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

  addGoals(goals: Record<string, number>){
    this.cardSets.forEach(set => {
      set.cards.forEach(card => {
        (["", "Vanilla", "Fire", "Water", "Earth", "Wind"]).forEach((element: string)  => {
          if(element == "" || card.cardType.element == element){
            (["", "Foil"]).forEach((type: string) => {
              var relevantCount = type == "" ? card.count : card.foilCount
              if(relevantCount >= 1){
                (["", "Unique", "10x", "100x"]).forEach((denomination: string) => {
                  if(denomination == "" || denomination == "Unique" 
                    || (denomination == "10x" && relevantCount >= 10) 
                    || (denomination == "100x" && relevantCount >= 100)){
                      (["", set.cardSet.title.replace(/\s/g, '')]).forEach((set: string) => {
                        var destination = `ownCards${denomination}${type}${element}${set}`
                        if(!Object.keys(goals).includes(destination)){
                          goals[destination] = 0
                        }
                        goals[destination] += (denomination == "" ? relevantCount : 1)
                      })
                  }
                })
              }
            })
          }
        })
      })
    })
  }

  loadCardDetails(loadedCardSets: Array<CardSet>, savedCardDetails: Array<SavedCardDetail>){
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

      var cardSetDetail: CardSetDetail = {
        cardSet: cardSet,
        cards: cardDetails, 
        byRarity: byRarity,
        cardPacks: []
      }
      
      this.cardSets.push(cardSetDetail)      
      
      var alternateMax = 4
      cardSetDetail.cardPacks.push({
        set: cardSetDetail,
        cardCount: 6,
        foilBoost: 0,
        texture: cardSetDetail.cardSet.icon,
        adjustment: "common",
        alternateMax: alternateMax,
        currentAlternate: Math.floor(Math.random() * alternateMax),
        baseCost: 20 * Math.pow(18, cardSetDetail.cardSet.id)
      })
      cardSetDetail.cardPacks.push({
        set: cardSetDetail,
        cardCount: 6,
        foilBoost: 0,
        texture: cardSetDetail.cardSet.icon,
        adjustment: "premium",
        alternateMax: 1,
        currentAlternate: 0,
        baseCost: 95 * Math.pow(18, cardSetDetail.cardSet.id)
      })
      cardSetDetail.cardPacks.push({
        set: cardSetDetail,
        cardCount: 6,
        foilBoost: 0,
        texture: cardSetDetail.cardSet.icon,
        adjustment: "deluxe",
        alternateMax: 1,
        currentAlternate: 0,
        baseCost: 225 * Math.pow(18, cardSetDetail.cardSet.id)
      })
    })

    this.cardSetsLoaded.next(null);
    console.log(this.cardSets)
  }

  getPrice(packType: PackType, discount?: Discount): number {
    if(packType == undefined){
      return 0
    }
    var realPrice = packType.baseCost

    if(discount != undefined){
      realPrice *= (1 - discount.discount) * discount.amount
    }

    return realPrice
  }
}
