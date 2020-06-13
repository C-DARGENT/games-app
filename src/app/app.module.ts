import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { services } from './services';

registerLocaleData(localFr);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, NgZorroAntdModule, FormsModule, HttpClientModule, BrowserAnimationsModule, TranslateModule],
  providers: [{ provide: NZ_I18N, useValue: en_US }, services]
})
export class AppModule {}
