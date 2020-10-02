import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesListPage } from './pages/games-list/games-list.page';

const routes: Routes = [
  { path: 'games-list', component: GamesListPage },
  { path: '', pathMatch: 'full', redirectTo: 'games-list' },
  { path: '**', pathMatch: 'full', redirectTo: 'games-list' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
