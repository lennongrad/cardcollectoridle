import { Injectable } from '@angular/core';
import { WindowOption, WindowType } from './interfaces';
import { DataManageService } from './data-manage.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  windowOptions: Array<WindowOption> = [
    { title: "Binder", image: "window_collection.png" },
    { title: "Store", image: "window_store.png" },
    { title: "Achievements", image: "window_achievements.png" },
    { title: "Settings", image: "window_settings.png" },
  ]

  activeWindow: WindowType = "Binder";

  getWindowOptions(): Array<WindowOption> {
    return this.windowOptions;
  }

  setActiveWindow(newWindow: WindowType) {
    this.activeWindow = newWindow;
  }

  getActiveWindow(): WindowType {
    return this.activeWindow;
  }

  constructor(private dataManageService: DataManageService) { }
}
