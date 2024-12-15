import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductionComponent } from './production/production.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BonusComponent } from './bonus/bonus.component';
import { BinderComponent } from './binder/binder.component';
import { StoreComponent } from './store/store.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './card/card.component';
import { PackDisplayComponent } from './pack-display/pack-display.component';
import { PackModelComponent } from './pack-model/pack-model.component';
import { AchievementboxComponent } from './achievementbox/achievementbox.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductionComponent,
    TopbarComponent,
    BonusComponent,
    BinderComponent,
    StoreComponent,
    AchievementsComponent,
    SettingsComponent,
    CardComponent,
    PackDisplayComponent,
    PackModelComponent,
    AchievementboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
