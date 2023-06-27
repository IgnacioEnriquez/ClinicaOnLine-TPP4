import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent {

  comentarioCancelacion: string = '';

  spinner: boolean = false;
  spinnerTabla: boolean = false;
  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;
  cancelacionTurno: boolean = false;

  listaTurnosEspecialista: any[] = [];
  listaDeEspecialistas: any[] = [];
  listaTurnos: any[] = [];
  turnosFiltrados: any[] = [];

  turnoACancelar: any = {};
  palabraBusqueda: string = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.spinnerTabla = true;

    this.authService.getTurnList().subscribe((turns: any) => {
      this.listaTurnosEspecialista = turns;
      this.listaTurnos = [];
      for (let i = 0; i < turns.length; i++) {
        const turnSpecialist = turns[i].turnos;
        for (let j = 0; j < turnSpecialist.length; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado != 'disponible') {
            this.listaTurnos.push(turn);
          }
        }
      }
      this.turnosFiltrados = [...this.listaTurnos];
      this.spinnerTabla = false;
      // console.log(this.listaTurnos);
    });


    this.authService.getUsers().subscribe((users) => {
      
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u) => u.perfil == 'especialista' && u.aprobado
        );
        console.log(this.listaDeEspecialistas); 
        this.spinner = false;               
      }
    });

  }//--------------------------------------------------------------------------------------------------

  formatearFecha(dia : any) : string
  {
    if(dia.seconds) {
      dia = new Date(dia.seconds * 1000);
    }
    let rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-0' + dia.getDate() + " " + dia.getHours() + ":"; 
    } else {
      rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate() + " " + dia.getHours() + ":";
    }
       

    if(dia.getMinutes() < 10)
    {
      rtn += "0" + dia.getMinutes() + "hs";
    }
    else
    {
      rtn += dia.getMinutes() + "hs";
    }


    return rtn;
  }//--------------------------------------------------------------------------------------------------

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;   
  }//--------------------------------------------------------------------------------------------------

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos'
      );
    } else {
      turno.estado = 'cancelado';
      turno.comentario = this.comentarioCancelacion;
      for (let i = 0; i < this.listaTurnosEspecialista.length; i++) {
        const turnosEspecialista = this.listaTurnosEspecialista[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
              new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.authService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }//--------------------------------------------------------------------------------------------------

  
  filtrarPorCamposAdministrador() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.listaTurnos];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.listaTurnos.length; i++) {
        const turno = this.listaTurnos[i];      
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toString().toLocaleLowerCase().includes(busqueda) ||      
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }//--------------------------------------------------------------------------------------------------

}
