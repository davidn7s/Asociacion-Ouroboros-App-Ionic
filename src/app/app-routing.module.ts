import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sorteo',
    loadChildren: () => import('./sorteo/sorteo.module').then( m => m.SorteoPageModule)
  },
  {
    path: 'sortear',
    loadChildren: () => import('./sortear/sortear.module').then( m => m.SortearPageModule)
  },
  {
    path: 'annadir',
    loadChildren: () => import('./annadir/annadir.module').then( m => m.AnnadirPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
