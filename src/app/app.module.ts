import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { components } from './components';
import { services } from './services';

registerLocaleData(localFr);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, ...components],
  imports: [AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, TranslateModule],
  providers: [services]
})
export class AppModule {}
