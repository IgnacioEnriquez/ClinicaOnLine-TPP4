import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.scss']
})
export class UsuariosAdminComponent {

  usersList: any[] = [];
  listadoUsuarios: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  spinner: boolean = true;
  emailUsuarioAux = "";
  passwordUsuarioAux = "";
  tipoRegistro = 2;

  

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit()
  {
    this.authService.getUsers().subscribe((users) => {
      this.spinner = false;
      if (users) {
        this.usersList = users;
      }    
      this.spinner = false;
      this.listadoUsuarios = true; 
      console.log(this.usersList);      
    });  

    this.authService.user$.subscribe((user : any)=>
    {
      if(user)
      {
        this.emailUsuarioAux = user.email;
        this.passwordUsuarioAux = user.password;    
      }
    })   

       
  } //--------------------------------------------------------------------------------------------------

  updateUser(user: User, option: number)
  {
    if (user.perfil == 'especialista') {
      if (option == 1) {
        user.aprobado = true;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Habilitado',
          'Administrador'
        );
      } else if (option == 2) {
        user.aprobado = false;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Deshabilitado',
          'Administrador'
        );
      }
    }
    
  } //--------------------------------------------------------------------------------------------------

  mostrarCreacionPaciente()
  {
    this.notificationService.showWarning("Al crear un usuario en esta parte del sistema, se volvera al inicio","Aviso de Registro");
    this.formPaciente = true;
    this.formEspecialista = false;
    this.formAdministrador = false;
    this.listadoUsuarios = false; 
  } //--------------------------------------------------------------------------------------------------

  cambiarFormulario(numero : number)
  {
    switch(numero)
    {
      case 1:
        this.formPaciente = false;
        this.formEspecialista = false;
        this.formAdministrador = true;     
      break;

      case 2:
        this.formPaciente = true;
        this.formEspecialista = false;
        this.formAdministrador = false;     
      break;

      case 3:
        this.formPaciente = false;
        this.formEspecialista = true;
        this.formAdministrador = false;     
      break;
    }

  } //--------------------------------------------------------------------------------------------------

  volverAListado()
  {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
    this.listadoUsuarios = true; 
    
  } //--------------------------------------------------------------------------------------------------
  
}
