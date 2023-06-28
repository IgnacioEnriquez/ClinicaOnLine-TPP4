import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {

  spinner: boolean = false;
  hayPacientesAtendidos : boolean = false;
  user: any = null;

  usersList: any[] = [];
  pacientesAtendidos: any[] = [];
  historialActivo: any[] = [];
  historialClinico: any[] = [];
  historialClinicoDelEspecialista: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit()
  {
    this.spinner = true;

    this.authService.user$.subscribe((user: any) => {
      this.spinner = false;
      if (user) {
        this.user = user;
        this.authService.isLogged = true;
      }
      this.authService.getUsers().subscribe((users) => {
        if (users) {
          this.usersList = users;
        }
        this.authService.getHistorialesClinicos().subscribe((historial) => {
          this.historialClinico = historial;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historial.forEach((h) => {
            for (let i = 0; i < this.usersList.length; i++) {
              const usuario = this.usersList[i];
              if (
                usuario.perfil == 'paciente' &&
                usuario.id == h.paciente.id &&
                this.user.id == h.especialista.id
              ) {
                this.usersList[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.id != usuario.id;
                  }
                );
                this.pacientesAtendidos.push(usuario);
                // console.log(this.usersList[i]);
              }
            }
          });

          this.historialClinicoDelEspecialista = this.historialClinico.filter(
            (h) => {
              return h.especialista.id == user.id;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          for (let i = 0; i < this.pacientesAtendidos.length; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.id == h.paciente.id) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (this.pacientesAtendidos.length == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
        });
      });
    });


  }


  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
  }

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

}
