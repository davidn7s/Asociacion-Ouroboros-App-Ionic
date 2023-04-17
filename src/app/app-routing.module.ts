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
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'modificar-usuario',
    loadChildren: () => import('./modificar-usuario/modificar-usuario.module').then( m => m.ModificarUsuarioPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'listado-juegos',
    loadChildren: () => import('./listado-juegos/listado-juegos.module').then( m => m.ListadoJuegosPageModule)
  },
  {
    path: 'annadir-juego',
    loadChildren: () => import('./annadir-juego/annadir-juego.module').then( m => m.AnnadirJuegoPageModule)
  },
  {
    path: 'juegos-evento',
    loadChildren: () => import('./juegos-evento/juegos-evento.module').then( m => m.JuegosEventoPageModule)
  },
  {
    path: 'ver-almacenamiento',
    loadChildren: () => import('./ver-almacenamiento/ver-almacenamiento.module').then( m => m.VerAlmacenamientoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
