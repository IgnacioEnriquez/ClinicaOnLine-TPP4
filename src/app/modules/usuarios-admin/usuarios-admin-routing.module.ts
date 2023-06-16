import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from 'src/app/components/usuarios-admin/usuarios-admin.component';

const routes: Routes = [

  {
    path: '',
    component: UsuariosAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosAdminRoutingModule { }
