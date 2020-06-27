import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataListComponent } from './components/data-list/data-list.component';

const routes: Routes = [
  { path: 'games-list', component: DataListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'games-list' },
  { path: '**', pathMatch: 'full', redirectTo: 'games-list' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
