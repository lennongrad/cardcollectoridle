import { HostListener, Injectable } from '@angular/core';
import { WindowOption, WindowType } from './interfaces';
import { DataManageService } from './data-manage.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  windowOptions: Array<WindowOption> = [
    { title: "Binder", image: "window_collection.png" },
    { title: "Achievements", image: "window_achievements.png" },
    { title: "Settings", image: "window_settings.png" },
  ]

  windowOptionsPhone: Array<WindowOption> = [
    { title: "Production", image: "window_hand.png" },
    { title: "Store", image: "window_money.png" },
    { title: "Binder", image: "window_collection.png" },
    { title: "Achievements", image: "window_achievements.png" },
    { title: "Settings", image: "window_settings.png" },
  ]

  currentOptions: Array<WindowOption> = this.windowOptions;

  activeWindow: WindowType = "Settings";

  getWindowOptions(): Array<WindowOption> {
    return this.currentOptions;
  }

  setActiveWindow(newWindow: WindowType) {
    this.activeWindow = newWindow;
  }

  getActiveWindow(): WindowType {
    return this.activeWindow;
  }
  
  onResize(width: number) {
    this.currentOptions = width > 900 ? this.windowOptions : this.windowOptionsPhone;
    if(width > 900 && this.activeWindow == "Production" || this.activeWindow == "Store"){
      this.activeWindow = "Binder"
    }
  }

  constructor(private dataManageService: DataManageService) { 
    this.onResize(window.innerWidth)
   }
}
