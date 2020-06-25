import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { services } from './services';

registerLocaleData(localFr);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule, TranslateModule],
  providers: [services]
})
export class AppModule {}
