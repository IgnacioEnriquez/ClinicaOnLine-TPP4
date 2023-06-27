import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent {

  
  user: any = null;
  isPaciente: boolean = false;
  especialidad: any = null;

  especialistaActivo: any = null;
  pacienteActivo: any = null;

  seleccionPacienteMenu: boolean = false;
  seleccionTurnoMenu: boolean = false; 
  HorariosActivos :  boolean = false; 
  spinner : boolean = false;
  spinnerHorarios : boolean = false;
  botonPedirTurno: boolean = false;
  turnoSeleccionado: any = null;

  listaDiasAMostrar: any[] = [];
  listaTurnosAMostrar: any[] = [];
  listaTurnosDeUnDiaAMostrar : any[] = [];
  listaEspecialistas : any[] = [];
  listaPacientes: any[] = [];
  listaTurnosEspecialista: any[] = [];


  especialistasFiltrados: any[] = [];
  palabraBusqueda: string = '';

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {        
        // console.log(user);
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
          this.seleccionPacienteMenu = true;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;
        } else {
          this.router.navigate(['']);
        }
        this.authService.getUsers().subscribe((users) => {       
          if (users) {
            this.listaEspecialistas = users.filter(
              (u) => u.perfil == 'especialista' && u.aprobado
            );
            this.especialistasFiltrados = this.listaEspecialistas;
            this.listaPacientes = users.filter((u) => u.perfil == 'paciente');
            // console.log(this.listaPacientes);
            // console.log(this.listaEspecialistas);
            this.authService.getTurnList().subscribe((turnosEspecialista) => {
              this.listaTurnosEspecialista = turnosEspecialista;
              // console.log(this.listaTurnosEspecialista);
            });
          }
          this.spinner = false;
        });
           
      }
      this.spinner = false;   
    });
  }//--------------------------------------------------------------------------------------------------

  filtrarPorCamposEspecialidad()
  {
    this.especialistasFiltrados = [];

    if (this.palabraBusqueda == '')
    {
      this.especialistasFiltrados = [...this.listaEspecialistas];
    }
    else
    {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();

      this.listaEspecialistas.forEach(especialista => {

        if (especialista.especialidad.nombre.toLocaleLowerCase().includes(busqueda))
        {
          {
            this.especialistasFiltrados.push(especialista);
          }
        }        
      });
     

    }

  }//--------------------------------------------------------------------------------------------------

  mostrarTurnos(especialista: any) {

    this.especialistaActivo = especialista;
    this.seleccionTurnoMenu = true;
    this.especialidad = especialista.especialidad;
    this.cargarHorasLibres('');   
    this.listaTurnosAMostrar.forEach((t) => {
      this.listaDiasAMostrar.push(t.fecha);
    });    

    const aux: any[] = [];

    this.listaDiasAMostrar.forEach((d) => {
      for (let i = 0; i < this.listaDiasAMostrar.length; i++) {
        const fecha = this.listaDiasAMostrar[i];
        if (
          d.getMonth() == fecha.getMonth() &&
          d.getDate() == fecha.getDate()
        ) {
          if (
            !aux.some((a) => {
              return d.getMonth() == a.getMonth() && d.getDate() == a.getDate();
            })
          ) {
            aux.push(d);
          }
        }
      }
    });
    aux.sort((a, b) => a - b);
    this.listaDiasAMostrar = [...aux];
   
  }//--------------------------------------------------------------------------------------------------

  cargarHorasLibres(day: string) {
    // console.log(day);
    const currentDate = new Date();
    const listaTurnosDelEspecialista = this.listaTurnosEspecialista.filter(
      (t) => t.especialista.email == this.especialistaActivo.email
    );

    const turnosEspecialidad =
      // listaTurnosDelEspecialista[0].turnos =
      listaTurnosDelEspecialista[0].turnos.filter((t: any) => {      
        return (
          t.especialidad == this.especialidad.nombre &&
          currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
        );
      });
    // console.log(listaTurnosDelEspecialista[0].turnos);
    // console.log(turnosEspecialidad);
    const turnos15dias: any[] = [];
    for (let i = 0; i < turnosEspecialidad.length; i++) {
      const turno = { ...turnosEspecialidad[i] };
      if (
        new Date(turno.fecha.seconds * 1000).getTime() <=
          currentDate.getTime() + 84600000 * 15 &&
        turno.estado == 'disponible'
      ) {
        turno.fecha = new Date(turno.fecha.seconds * 1000);
        turnos15dias.push(turno);
      }
    }
       

    this.listaTurnosAMostrar = [...turnos15dias];
  }  //--------------------------------------------------------------------------------------------------

  cargarHorasLibresUnDia(day: Date)
  {
    console.log(this.listaDiasAMostrar);
    this.botonPedirTurno = false;
    this.spinnerHorarios = true;
    this.listaTurnosDeUnDiaAMostrar = [];
    setTimeout(() => {
      const currentDate = new Date();
      const listaTurnosDelEspecialista = this.listaTurnosEspecialista.filter(
        (t) => t.especialista.email == this.especialistaActivo.email
      );
      const turnosEspecialidad =
        // listaTurnosDelEspecialista[0].turnos =
        listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
          return (
            t.especialidad == this.especialidad.nombre &&
            currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
          );
        });
      // console.log(listaTurnosDelEspecialista[0].turnos);
      // console.log(turnosEspecialidad);
      const turnosDeUndia: any[] = [];
      for (let i = 0; i < turnosEspecialidad.length; i++) {
        const turno = { ...turnosEspecialidad[i] };
        if (
          new Date(turno.fecha.seconds * 1000).getTime() <=
            currentDate.getTime() + 84600000 * 15 &&
          new Date(turno.fecha.seconds * 1000).getDate() == day.getDate() &&
          turno.estado == 'disponible'
        ) {
          turno.fecha = new Date(turno.fecha.seconds * 1000);
          turnosDeUndia.push(turno);
        }
      }
      this.spinnerHorarios = false;
      this.HorariosActivos = true;
      this.listaTurnosDeUnDiaAMostrar =[...turnosDeUndia];
    }, 500);
    

  }//--------------------------------------------------------------------------------------------------

  formatearFecha(dia : any) : string
  {
    if(dia.seconds) {
      dia = new Date(dia.seconds * 1000);
    }
    let rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-0' + dia.getDate();
    } else {
      rtn = dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
    }
    return rtn;
  }//--------------------------------------------------------------------------------------------------

  formatearHora(fecha : any) : string
  {
    let rtn = fecha.getHours() + ':' + fecha.getMinutes();
    if (rtn.split(':')[1] == '0') {
      rtn = rtn + '0';
    }
    if (parseInt(rtn.split(':')[0]) < 10) {
      rtn = '0' + rtn;
    }    
    // rtn = rtn + "hs";
    return rtn;
  }//--------------------------------------------------------------------------------------------------

  seleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.botonPedirTurno = true;
    this.notificationService.showInfo('Turno seleccionado', 'Turnos');
  }//--------------------------------------------------------------------------------------------------

  solicitarTurno() {
    if (this.isPaciente) {
      this.turnoSeleccionado.paciente = this.user;
      this.turnoSeleccionado.estado = 'solicitado';
    } else {
      this.turnoSeleccionado.paciente = this.pacienteActivo;
      this.turnoSeleccionado.estado = 'solicitado';
    }
    for (let i = 0; i < this.listaTurnosEspecialista.length; i++) {
      const turnosEspecialista = this.listaTurnosEspecialista[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
            this.turnoSeleccionado.fecha.getTime() &&
          t.especialidad == this.turnoSeleccionado.especialidad
        );
      });
      turnosEspecialista.turnos[index] = this.turnoSeleccionado;
      this.authService.updateTurnList(turnosEspecialista);
    }
    this.listaTurnosAMostrar = [];
    this.listaTurnosDeUnDiaAMostrar = [];
    this.botonPedirTurno = false;
    this.spinner = true;
    
    setTimeout(() => {
      this.spinner = false;
      this.HorariosActivos = false;      
      this.notificationService.showSuccess('Turno Solicitado', 'Turnos');
      this.cargarHorasLibres('');
    }, 1000);
  }//--------------------------------------------------------------------------------------------------

  mostrarPaciente(paciente: any) {
    this.seleccionPacienteMenu = false;
    this.pacienteActivo = paciente;
    this.spinner = true;
    
    setTimeout(()=>{
      this.spinner = false;
    },3000);
  }//--------------------------------------------------------------------------------------------------
}
