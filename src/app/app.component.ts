import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ProductionService } from './production.service';
import { WindowService } from './window.service';
import { WindowType } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  constructor(
    private productionService: ProductionService,
    private windowService: WindowService){}

  getActiveWindow(): WindowType {
    return this.windowService.getActiveWindow()
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    switch(event.key){
      case "e": this.productionService.exp += 1000; break;
      case "c": this.productionService.cash += 100; break;
    }
  }
}