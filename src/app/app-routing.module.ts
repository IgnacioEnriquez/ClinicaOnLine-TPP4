import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'bienvenido',
    loadChildren: () =>
    import('./modules/bienvenida/bienvenida.module').then((m) => m.BienvenidaModule),
    data: { animation: 'Home' }
  },
  {
    path: 'turnos',
    loadChildren: () =>
    import('./modules/turnos/turnos.module').then((m) => m.TurnosModule),
  },
  {
    path: 'login-register',
    loadChildren: () =>
    import('./modules/login-register/login-register.module').then((m) => m.LoginRegisterModule),
    data: { animation: 'Login' }
  },
  {
    path: 'admin/usuarios',
    loadChildren: () =>
    import('./modules/usuarios-admin/usuarios-admin.module').then((m) => m.UsuariosAdminModule),
    
  },
  {
    path: 'misTurnos',
    loadChildren: () =>
    import('./modules/mis-turnos/mis-turnos.module').then((m) => m.MisTurnosModule),
    
  },
  {
    path: 'pacientes',
    loadChildren: () =>
    import('./modules/pacientes/pacientes.module').then((m) => m.PacientesModule),
  },
  {
    path: 'miPerfil',
    loadChildren: () =>
    import('./modules/mi-perfil/mi-perfil.module').then((m) => m.MiPerfilModule),
  },
  {
    path: 'solicitarTurno',
    loadChildren: () =>
    import('./modules/solicitar-turno/solicitar-turno.module').then((m) => m.SolicitarTurnoModule),
    data:{animation: 'Turnos'}
  },
  {
    path: 'informes',
    loadChildren: () =>
    import('./modules/informes/informes.module').then((m) => m.InformesModule),
    data:{animation: 'Turnos'}
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
