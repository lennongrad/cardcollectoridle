import { Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { CardDetail, CardElement, CardRarity, CardType } from '../interfaces';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.less'
})
export class CardComponent {
  @Input() card?: CardType;
  @Input() isFoil: boolean = false;

  // card sizes
  crownWidth: number = 200;
  crownHeight: number = 80;
  // font sizes
  fontSizeTiny: number = 0;
  fontSizeSmall: number = 0;
  fontSizeMedium: number = 0;
  fontSizeLarge: number = 0;

  lastMoveX: number = 0
  lastMoveY: number = 0
  
  width: number = 0
  height: number = 0

  borderColors: Record<CardElement, Array<string>> = {
    "Vanilla": ["#818181", "#555", "rgba(201, 216, 201, .3)"],
    "Fire": ["#B15151", "#853535", "rgba(251, 116, 101, .3)"],
    "Water": ["#4141C1", "#353585", "rgba(101, 116, 251, .3)"],
    "Earth": ["#41B141", "#358535", "rgba(101, 256, 101, .3)"],
    "Wind": ["#818111", "#656525", "rgba(191, 196, 30, .3)"],
  }

  rarityColors: Record<CardRarity, string> = {
    "Common": "#333",
    "Uncommon": "#777",
    "Rare": "#771",
    "Mystic": "#A51"
  }

  constructor(private element: ElementRef, private sanitizer: DomSanitizer){ 
  }

  @HostBinding("attr.style")
  public get valueAsStyle(): any {

    var borderColor = ""
    if(this.card != undefined){
      borderColor = this.borderColors[this.card?.element][0]
    }

    var backgroundColor = ""
    if(this.card != undefined){
      backgroundColor = this.borderColors[this.card?.element][2]
    }

    var textColor = ""
    if(this.card != undefined){
      textColor = this.borderColors[this.card?.element][1]
    }

    var rarityColor = ""
    if(this.card != undefined){
      rarityColor = this.rarityColors[this.card?.rarity]
    }

    return this.sanitizer.bypassSecurityTrustStyle(`
      --border-color: ${borderColor}; 
      --background-color: ${backgroundColor};
      --text-color: ${textColor};
      --rarity-color: ${rarityColor}
    `);
  }

  setCardDimensions(){
    var containerWidth = this.element.nativeElement.offsetWidth;
    var containerHeight = this.element.nativeElement.offsetHeight;

    // set font sizes
    this.fontSizeTiny = containerWidth * .03;
    this.fontSizeSmall = containerWidth * .045;
    this.fontSizeMedium = containerWidth * .055;
    this.fontSizeLarge = containerWidth * .065;
  }

  getCardStyle(): any {
    var yDegrees = -this.lastMoveY * 20
    var xDegrees = this.lastMoveX * 20

    return {
      "transform": `rotate3d(1, 0, 0, ${yDegrees}deg) rotate3d(0, 1, 0, ${xDegrees}deg)`,
    }
  }

  getGlowStyle(): any{
    var xPosition = (this.lastMoveX + 1)/2 * 80
    var yPosition = (this.lastMoveY + 1)/2 * 80

    return {
      "background": `radial-gradient(circle at ${xPosition}% ${yPosition}%, white 20%, black 80%, black)`
    }
  }

  getSpecularStyle(): any{
    var xPosition = (this.lastMoveX + 1)/2 * 80
    var yPosition = (this.lastMoveY + 1)/2 * 80

    if(this.lastMoveX == 0){
      return {"opacity": .3}
    }

    return {
      "-webkit-mask-image": `radial-gradient(circle at ${xPosition}% ${yPosition}%, white 20%, transparent 80%, transparent)`
    }
  }

  ngOnInit(){
    this.setCardDimensions();
  }

  onMouseMove(event: MouseEvent) {  
    this.width = this.element.nativeElement.getBoundingClientRect().width
    this.height = this.element.nativeElement.getBoundingClientRect().height
    this.lastMoveX = Math.max(-1, Math.min(1, 2 * event.offsetX / this.width - 1))
    this.lastMoveY = 2 * event.offsetY / this.height - 1
  }

  onMouseOut(event: MouseEvent) {
    this.lastMoveX = 0
    this.lastMoveY = 0
  }
}
