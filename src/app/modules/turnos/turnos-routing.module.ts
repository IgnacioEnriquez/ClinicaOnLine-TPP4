import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosComponent } from 'src/app/components/turnos/turnos.component';

const routes: Routes = [
{
path: '',
component: TurnosComponent
}];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
