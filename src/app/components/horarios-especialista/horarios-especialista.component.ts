import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-horarios-especialista',
  templateUrl: './horarios-especialista.component.html',
  styleUrls: ['./horarios-especialista.component.scss'],
})
export class HorariosEspecialistaComponent {
  
  @Output() actualizarScreen : EventEmitter<any> = new EventEmitter<any>();

  user: any = null;
  spinner: boolean = false;
  diasEspecialista: any[] = [];
  

  listaActualTurnos: any = {};

  lunes: boolean = false;
  martes: boolean = false;
  miercoles: boolean = false;
  jueves: boolean = false;
  viernes: boolean = false;
  sabado: boolean = false;
  duracionTurno: number = 30;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        // console.log(user);
        this.user = user;
        this.authService.isLogged = true;

        if (this.user.especialidad.diasTurnos) {
          this.diasEspecialista = [...this.user.especialidad.diasTurnos];
          this.duracionTurno = this.user.especialidad.duracionTurno;
          this.activarBotonDia();
          // console.log(this.diasEspecialista);
          this.authService.getTurnList().subscribe((turnosEspecialista) => {
            for (let i = 0; i < turnosEspecialista.length; i++) {
              const listaTurnos = turnosEspecialista[i];
              if (this.user.email == listaTurnos.especialista.email) {
                this.listaActualTurnos = listaTurnos;
                // console.log(listaTurnos);
                // console.log(this.listaActualTurnos);
              }
            }
            // console.log(turnosEspecialista);
          });
        }
      }
    });

   
  }//--------------------------------------------------------------------------------------------------

  activarBotonDia() {
    this.diasEspecialista.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = true;
          break;
        case 'martes':
          this.martes = true;
          break;
        case 'miércoles':
          this.miercoles = true;
          break;
        case 'jueves':
          this.jueves = true;
          break;
        case 'viernes':
          this.viernes = true;
          break;
        case 'sábado':
          this.sabado = true;
          break;
      }
    });
  } //--------------------------------------------------------------------------------------------------

  desactivarBotonDia() {
    this.diasEspecialista.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = false;
          break;
        case 'martes':
          this.martes = false;
          break;
        case 'miércoles':
          this.miercoles = false;
          break;
        case 'jueves':
          this.jueves = false;
          break;
        case 'viernes':
          this.viernes = false;
          break;
        case 'sábado':
          this.sabado = false;
          break;
      }
    });
  } //--------------------------------------------------------------------------------------------------

  addDay(day: string) {
    if (
      !this.diasEspecialista.some((d) => d == day) &&
      !this?.user?.especialidad?.diasTurnos?.some((d: any) => d == day)
    ) {
      this.diasEspecialista.push(day);
      this.notificationService.showInfo('Día asignado', 'Mi Perfil');
      this.cambiarFlagDia(day);
    } else {
      const index = this.diasEspecialista.indexOf(day);
      this.diasEspecialista.splice(index, 1);
      this.notificationService.showInfo(
        'Asignación de día cancelada',
        'Mi Perfil'
      );
      this.cambiarFlagDia(day);
    }

    
  } //--------------------------------------------------------------------------------------------------

  cambiarFlagDia(day: string) {
    switch (day) {
      case 'lunes':
        this.lunes = !this.lunes;
        break;
      case 'martes':
        this.martes = !this.martes;
        break;
      case 'miércoles':
        this.miercoles = !this.miercoles;
        break;
      case 'jueves':
        this.jueves = !this.jueves;
        break;
      case 'viernes':
        this.viernes = !this.viernes;
        break;
      case 'sábado':
        this.sabado = !this.sabado;
        break;
    }
  } //--------------------------------------------------------------------------------------------------

  actualizarUsuario() {
    let esp: any = {};

    esp.nombre = this.user.especialidad.nombre;
    esp.diasTurnos = [...this.diasEspecialista];
    esp.duracionTurno = this.duracionTurno;

    this.user.especialidad = esp;

    //--------------------------------------------------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------//

    const listaDeTurnos: any[] = [];
    const fechaActual = new Date();
    const turnDuration = this.duracionTurno * 60000;

    for (let i = 0; i < this.diasEspecialista.length; i++) {
      const day = this.diasEspecialista[i];
      let dayNumber = 0;
      switch (day) {
        case 'lunes':
          dayNumber = 1;
          break;
        case 'martes':
          dayNumber = 2;
          break;
        case 'miércoles':
          dayNumber = 3;
          break;
        case 'jueves':
          dayNumber = 4;
          break;
        case 'viernes':
          dayNumber = 5;
          break;
        case 'sábado':
          dayNumber = 6;
          break;
      }

      //-----------------------------------CREACION TURNOS--------------------------------------------//

      for (let j = 1; j <= 60; j++) {
        const date = new Date(fechaActual.getTime() + 84600000 * j);
        if (date.getDay() == dayNumber) {
          let turnDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            8
          );
          let turnoNew: any = {};
          turnoNew.estado = 'disponible';

          turnoNew.especialidad = this.user.especialidad.nombre;
          turnoNew.especialista = this.user;
          turnoNew.paciente = null;
          turnoNew.fecha = new Date(turnDay.getTime());
          listaDeTurnos.push(turnoNew);

          while (turnDay.getHours() < 19) {
            turnoNew = {};
            turnDay = new Date(turnDay.getTime() + turnDuration);
            if (turnDay.getHours() != 19) {
              turnoNew.estado = 'disponible';

              turnoNew.especialidad = this.user.especialidad.nombre;
              turnoNew.especialista = this.user;
              turnoNew.paciente = null;
              turnoNew.fecha = new Date(turnDay.getTime());
              listaDeTurnos.push(turnoNew);
            }
          }
        }
      }
    }

    //---------------------------ACA SE CREA LA LISTA DE TURNOS QUE VA A LA BD ------------------------//
    const turno: any = {};

    if (this.listaActualTurnos.id) {
      turno.id = this.listaActualTurnos.id;
    }

    turno.especialista = this.user;
    turno.turnos = listaDeTurnos;

    if (this.listaActualTurnos?.turnos?.length) {
      let especialidad: string = '';

      especialidad = this.user.especialidad.nombre;

      this.listaActualTurnos.turnos = this.listaActualTurnos.turnos.filter(
        (t: any) => {
          return (
            (t.estado != 'disponible' && t.especialidad == especialidad) ||
            t.especialidad != especialidad
          );
        }
      );

      turno.turnos = [...this.listaActualTurnos.turnos];

      for (let i = 0; i < listaDeTurnos.length; i++) {
        const newTurn = listaDeTurnos[i];
        turno.turnos.push(newTurn);
      }     
    
       this.authService.updateTurnList(turno);
    } else {         
      this.authService.createTurnList(turno);
    }    
    this.authService.updateUser(this.user);
    this.notificationService.showSuccess('Horarios actualizados', 'Mi Perfil');
  }

  volverAPerfil()
  {
    this.actualizarScreen.emit();
  }
}//--------------------------------------------------------------------------------------------------
