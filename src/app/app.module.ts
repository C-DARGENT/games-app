import { registerLocaleData } from '@angular/common';
import localFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { components } from './components';
import { pages } from './pages';
import { services } from './services';

registerLocaleData(localFr);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, ...components, ...pages],
  imports: [AppRoutingModule, SharedModule],
  providers: [services]
})
export class AppModule {}
