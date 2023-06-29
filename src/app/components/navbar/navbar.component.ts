import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  user: any = null;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  esAdmin : boolean = false;
  spinner_nav: boolean = false;

  constructor(private router : Router, public authService: AuthService) {       
  }
  
  ngOnInit(): void {
    this.spinner_nav = true;
    setTimeout(()=>
    {
      this.spinner_nav = false;
    },3000)   
    
    this.authService.user$.subscribe((user: any) => {
      if (user) {

        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {

          this.esAdmin = true;
          this.esPaciente = false;
          this.esEspecialista = false;

        } else if (this.user.perfil == 'paciente') {

          this.esPaciente = true;
          this.esAdmin = false;
          this.esEspecialista = false;

        } else {

          this.esEspecialista = true;
          this.esPaciente = false;
          this.esAdmin = false;
        }
      }
    });
  } //--------------------------------------------------------------------------------------------------

  goToLogin() {
    this.router.navigate(['/login-register']);
  } //--------------------------------------------------------------------------------------------------

  goToSolicitarTurno() {
    this.router.navigate(['/solicitarTurno']);
  } //--------------------------------------------------------------------------------------------------

  goToUsuario()
  {
    this.router.navigate(['/admin/usuarios']);
  } //--------------------------------------------------------------------------------------------------

  goToMisTurnos()
  {
    this.router.navigate(['misTurnos']);
  } //--------------------------------------------------------------------------------------------------

  goToBienvenido()
  {
    this.router.navigate(['/bienvenido'])
  } //--------------------------------------------------------------------------------------------------

  goToMiPerfil()
  {
    this.router.navigate(['/miPerfil'])

  } //--------------------------------------------------------------------------------------------------

  goToTurnos()
  {
    this.router.navigate(['/turnos']);
  }//--------------------------------------------------------------------------------------------------

  goToPacientes()
  {
    this.router.navigate(['/pacientes']);
  }//--------------------------------------------------------------------------------------------------

  goToInformes()
  {
    this.router.navigate(['/informes']);
  }//--------------------------------------------------------------------------------------------------

  cerrarSesion() {
    this.authService.userLogout();
    this.user = null;
    this.authService.isLogged = false;
    this.esAdmin = false;
    this.esPaciente = false;
    this.esEspecialista = false;
    this.router.navigate(["/bienvenido"]);
  } //--------------------------------------------------------------------------------------------------

}
