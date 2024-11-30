import { Injectable } from '@angular/core';
import { WindowOption, WindowType } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  windowOptions: Array<WindowOption> = [
    { title: "Labor", image: "window_labor.png" },
    { title: "Store", image: "window_store.png" },
    { title: "Collection", image: "window_collection.png" },
    { title: "Achievements", image: "window_achievements.png" },
    { title: "Settings", image: "window_settings.png" },
  ]

  activeWindow: WindowType = "Labor";

  getWindowOptions(): Array<WindowOption> {
    return this.windowOptions;
  }

  setActiveWindow(newWindow: WindowType) {
    this.activeWindow = newWindow;
  }

  getActiveWindow(): WindowType {
    return this.activeWindow;
  }

  constructor() { }
}
