import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'bienvenido',
    loadChildren: () =>
    import('./modules/bienvenida/bienvenida.module').then((m) => m.BienvenidaModule),
  },
  {
    path: 'login-register',
    loadChildren: () =>
    import('./modules/login-register/login-register.module').then((m) => m.LoginRegisterModule),
  },
  {
    path: 'admin/usuarios',
    loadChildren: () =>
    import('./modules/usuarios-admin/usuarios-admin.module').then((m) => m.UsuariosAdminModule),
  },
  {
    path: '',
    redirectTo: 'bienvenido',
    pathMatch: 'full',
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
