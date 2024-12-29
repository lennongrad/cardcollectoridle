import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { CardElement, CardRarity, CardSet, CardSubtype, CardType, ProductionType } from './interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManageService {
  constructor(private http: HttpClient, private papa: Papa) { }

  parseCSV<T>(filename: string, handlerMethod: Function): Subject<T> {
    var subject = new Subject<T>();

    this.http.get(filename, {responseType: 'text'}).subscribe(
      data => {
        let options = {
            complete: (results: any, file: any) => {
              subject.next(handlerMethod(results.data));
            }
        };

        this.papa.parse(data,options);
      },
      error => {
          console.log(error);
      }
    );

    return subject;
  }

  beginParsingProduction(): Subject<Array<ProductionType>> {
    return this.parseCSV("assets/production.csv", this.handleProductionCSV.bind(this));
  }

  handleProductionCSV(data: Array<Array<string>>) {
    var loadedProductionTypes: Array<ProductionType> = []

    data.forEach((row: Array<string>, index: number) => {
      loadedProductionTypes?.push({
        "id": index,
        "title": row[0],
        "icon": row[1],
        "power": Number(row[2])
      })
    })

    return loadedProductionTypes
  }

  beginParsingCards(): Subject<Array<CardSet>> {
    return this.parseCSV("assets/card.csv", this.handleCardsCSV.bind(this));
  }

  handleCardsCSV(data: Array<Array<string>>) {
    var loadedCardSets: Array<CardSet> = []
    var currentCardSet: CardSet | null;
    var c = 0;

    var cardSets: any = {
      "base": 180,
      "metamorphosis": 266,
      "survival": 170,
      "domination": 200
    }

    data.forEach((row: Array<string>, index: number) => {
      if(row[0] == "---") {
        var newCards: Array<CardType> = []
        currentCardSet = {
          id: loadedCardSets.length,
          title: row[1],
          icon: row[2],
          cost: Number(row[3]),
          width: cardSets[row[2]] as number,
          cards: newCards
        }
        loadedCardSets.push(currentCardSet)
      } else if(currentCardSet != null) {
        c+= 1
        currentCardSet.cards.push({
          id: currentCardSet.id + "-" + currentCardSet.cards.length,
          title: row[0],
          icon: Number(row[7]),
          subtype: row[1] as CardSubtype,
          evolvesFrom: row[2],
          cost: Number(row[3]),
          element: row[4] as CardElement,
          stars: Number(row[5]),
          rarity: row[6] as CardRarity,
          set: currentCardSet
        })
      }
    })

    return loadedCardSets;
  }  
}