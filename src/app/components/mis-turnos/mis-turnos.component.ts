import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss'],
})
export class MisTurnosComponent {
  spinner: boolean = false;
  spinnerTabla: boolean = false;
  user: any = null;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  cancelacionTurno: boolean = false;
  vistaComentario: boolean = false;
  vistaComentarioCalificacion: boolean = false;
  botonRechazar: boolean = true;
  confirmacionFinalizacion: boolean = false;
  botonCancelar: boolean = true;
  confirmacionRechazo: boolean = false;

  listaTurnosFiltrados: any[] = [];
  listaTurnosEspecialista: any[] = [];
  listaTurnosActualesEspecialista: any[] = [];
  listaTurnos: any[] = [];
  listaDeEspecialistas: any[] = [];
  listaTurnosDelEspecialista: any[] = [];
  listaTurnosDelPaciente: any[] = [];
  listaPacientesDelEspecialista: any[] = [];
  auxPacientesDelEspecialista: any[] = [];  

  turnoACancelar: any = {};
  turnoACalificar: any = {};
  turnoAFinalizar: any = {};
  turnoFinalizado: any = {};

  comentarioCancelacion: string = '';
  comentarioCalificacion: string = '';
  comentarioFinalizacion: string = '';
  palabraBusqueda: string = '';
  

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.spinner = true;
    this.spinnerTabla = true;

    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;
        } else {
          this.isEspecialista = true;
        }

        this.authService.getTurnList().subscribe((turns: any) => {
          this.listaTurnosActualesEspecialista = turns;
          this.listaTurnos = [];
          this.listaTurnosFiltrados = [];
          this.listaTurnosDelPaciente = [];
          this.listaTurnosDelEspecialista = [];
          this.listaPacientesDelEspecialista = [];
          this.auxPacientesDelEspecialista = [];

          for (let i = 0; i < turns.length; i++) {
            const turnSpecialist = turns[i].turnos;

            for (let j = 0; j < turnSpecialist.length; j++) {
              const turn = turnSpecialist[j];

              if (turn.estado != 'disponible') {
                this.listaTurnos.push(turn);

                if (turn.paciente.id == this.user.id) {
                  this.listaTurnosDelPaciente.push(turn);
                }
                if (turn.especialista.id == this.user.id) {
                  this.listaTurnosDelEspecialista.push(turn);
                  this.auxPacientesDelEspecialista.push(turn.paciente);
                }
              }
            }
          }

          for (let i = 0; i < this.auxPacientesDelEspecialista.length; i++) {
            const paciente = this.auxPacientesDelEspecialista[i];
            const index = this.listaPacientesDelEspecialista.findIndex((p) => {
              return paciente.id == p.id;
            });
            if (index == -1) {
              this.listaPacientesDelEspecialista.push(paciente);
            }
          }

          if (this.isPaciente) {
            this.listaTurnosFiltrados = [...this.listaTurnosDelPaciente];
          } else if (this.isEspecialista) {
            this.listaTurnosFiltrados = [...this.listaTurnosDelEspecialista];
          }
          // console.log(this.listaPacientesDelEspecialista);
          // console.log(this.listaTurnosDelEspecialista);
          // console.log(this.listaTurnosDelPaciente);
          // console.log(this.listaTurnos);
          this.spinnerTabla = false;
        });
      }
      this.spinner = false;
    });

    this.authService.getUsers().subscribe((users) => {      
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u) => u.perfil == 'especialista' && u.aprobado
        );        
      }
    });
  }//--------------------------------------------------------------------------------------------------

  formatearFecha(dia: any): string {
    if (dia.seconds) {
      dia = new Date(dia.seconds * 1000);
    }
    let rtn =
      dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn =
        dia.getFullYear() +
        '-' +
        (dia.getMonth() + 1) +
        '-0' +
        dia.getDate() +
        ' ' +
        dia.getHours() +
        ':';
    } else {
      rtn =
        dia.getFullYear() +
        '-' +
        (dia.getMonth() + 1) +
        '-' +
        dia.getDate() +
        ' ' +
        dia.getHours() +
        ':';
    }

    if (dia.getMinutes() < 10) {
      rtn += '0' + dia.getMinutes() + 'hs';
    } else {
      rtn += dia.getMinutes() + 'hs';
    }

    return rtn;
  }//--------------------------------------------------------------------------------------------------

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }//--------------------------------------------------------------------------------------------------

  cancelarTurnoEspecialista(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }//--------------------------------------------------------------------------------------------------

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentarioPaciente = this.comentarioCancelacion;
      for (let i = 0; i < this.listaTurnosActualesEspecialista.length; i++) {
        const turnosEspecialista = this.listaTurnosActualesEspecialista[i];
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
      this.spinnerTabla = true;
      setTimeout(() => {
        this.spinner = false;
        this.spinnerTabla = false;

        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }//--------------------------------------------------------------------------------------------------

  aceptarTurno(turno: any) {
    turno.estado = 'aceptado';
    for (let i = 0; i < this.listaTurnosActualesEspecialista.length; i++) {
      const turnosEspecialista = this.listaTurnosActualesEspecialista[i];
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
    this.spinnerTabla = true;
    setTimeout(() => {
      this.spinnerTabla = false;
      this.spinner = false;
      this.vistaComentario = false;
      this.vistaComentarioCalificacion = false;
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess('Turno Aceptado', 'Turnos');
    }, 1000);
  }//--------------------------------------------------------------------------------------------------

  finalizarTurno(turno: any) {
    this.turnoAFinalizar = { ...turno };
    this.confirmacionFinalizacion = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
  }//--------------------------------------------------------------------------------------------------

  confirmarCancelacionRechazoEspecialista(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación o rechazo',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentario = this.comentarioCancelacion;
      for (let i = 0; i < this.listaTurnosActualesEspecialista.length; i++) {
        const turnosEspecialista = this.listaTurnosActualesEspecialista[i];
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
      this.spinnerTabla = true;
      setTimeout(() => {
        this.spinner = false;
        this.spinnerTabla = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionRechazo = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }//--------------------------------------------------------------------------------------------------

  confirmarFinalizacion(turno: any) {
    turno.estado = 'realizado';
    turno.comentario = this.comentarioFinalizacion;
    for (let i = 0; i < this.listaTurnosActualesEspecialista.length; i++) {
      const turnosEspecialista = this.listaTurnosActualesEspecialista[i];
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
    this.spinnerTabla = true;
    setTimeout(() => {
      this.spinner = false;
      this.spinnerTabla = false;
      this.turnoACancelar = {};
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess('Turno Finalizado', 'Turnos');
    }, 1000);
  }//--------------------------------------------------------------------------------------------------
  
  verComentario(turno: any) {
    this.turnoACancelar = { ...turno };
    this.vistaComentario = true;
    this.cancelacionTurno = false;
    this.vistaComentarioCalificacion = false;
    this.botonCancelar = true;
    this.confirmacionFinalizacion = false;
  }//--------------------------------------------------------------------------------------------------

  rechazarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.botonCancelar = !this.botonCancelar;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.cancelacionTurno = true;
    this.confirmacionRechazo = true;
    this.confirmacionFinalizacion = false;
  }//--------------------------------------------------------------------------------------------------

  calificarTurno(turno: any) {
    this.turnoACalificar = { ...turno };
    this.vistaComentarioCalificacion = true;
    this.vistaComentario = false;
    this.confirmacionFinalizacion = false;
  }//--------------------------------------------------------------------------------------------------

  confirmarCalificacion(turno: any) {
    if (this.comentarioCalificacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario para calificar.',
        'Turnos'
      );
    } else {
      turno.comentarioPaciente = this.comentarioCalificacion;
      for (let i = 0; i < this.listaTurnosActualesEspecialista.length; i++) {
        const turnosEspecialista = this.listaTurnosActualesEspecialista[i];
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
      this.spinnerTabla = true;

      setTimeout(() => {
        this.spinner = false;
        this.spinnerTabla = false;

        this.turnoACalificar = {};
        this.vistaComentarioCalificacion = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Calificado', 'Turnos');
      }, 1000);
    }
  }//--------------------------------------------------------------------------------------------------

  filtrarPorCamposPaciente() {
    this.listaTurnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.listaTurnosFiltrados = [...this.listaTurnosDelPaciente];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.listaTurnosDelPaciente.length; i++) {
        const turno = this.listaTurnosDelPaciente[i];        
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
          this.listaTurnosFiltrados.push(turno);
        }
      }
    }
  }//--------------------------------------------------------------------------------------------------
  
  filtrarPorCamposEspecialista() {
    this.listaTurnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.listaTurnosFiltrados = [...this.listaTurnosEspecialista];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.listaTurnosEspecialista.length; i++) {
        const turno = this.listaTurnosEspecialista[i];
       
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||         
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
          this.listaTurnosFiltrados.push(turno);
        }
      }
    }
  }//--------------------------------------------------------------------------------------------------
  
}
