import { Component } from '@angular/core';
import { ProductionService } from '../production.service';
import { WindowService } from '../window.service';
import { WindowOption, WindowType } from '../interfaces';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.less'
})
export class TopbarComponent {
  constructor(
    private productionService: ProductionService,
    private windowService: WindowService
  ){}

  getWindowOptions(): Array<WindowOption>{
    return this.windowService.getWindowOptions()
  }

  getCashAmount(): string{
    return this.productionService.getCashAmount();
  }

  setActiveWindow(newWindow: WindowType){
    this.windowService.setActiveWindow(newWindow)
  }

  getActiveWindow(): WindowType{
    return this.windowService.getActiveWindow();
  }
}
