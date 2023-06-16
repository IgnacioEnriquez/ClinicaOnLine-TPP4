import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'clinica-OnLine';
  user: any = null;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
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

          this.authService.isAdmin = true;

        } else if (this.user.perfil == 'paciente') {

          this.esPaciente = true;

        } else {

          this.esEspecialista = true;
        }
      }
    });
  } //--------------------------------------------------------------------------------------------------

  goToLogin() {
    this.router.navigate(['/login-register']);
  } //--------------------------------------------------------------------------------------------------

  goToUsuario()
  {
    this.router.navigate(['/admin/usuarios']);
  } //--------------------------------------------------------------------------------------------------

  goToBienvenido()
  {
    this.router.navigate(['/bienvenido'])
  } //--------------------------------------------------------------------------------------------------

  cerrarSesion() {
    this.authService.userLogout();
    this.user = null;
    this.authService.isLogged = false;
    this.router.navigate(["/bienvenido"]);
  } //--------------------------------------------------------------------------------------------------
}
