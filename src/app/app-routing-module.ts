import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesListComponent } from './components/games-list/games-list.component';

const routes: Routes = [
  { path: 'games-list', component: GamesListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'games-list' },
  { path: '**', pathMatch: 'full', redirectTo: 'games-list' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
