import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent {

  formLogin: FormGroup;
  spinner: boolean = false; 
  userLogin: User = new User();
  campoCargado: boolean = false; 

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router ) {
    
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });     
  } //--------------------------------------------------------------------------------------------------

  loginUser()
  {
    if (this.formLogin.valid) {
      this.spinner = true;
      this.userLogin.email = this.formLogin.getRawValue().email;
      this.userLogin.password = this.formLogin.getRawValue().password;
      this.authService
        .userLogin(this.userLogin.email, this.userLogin.password)
        .then(async (data: any) => { 

          this.authService.user$.subscribe((user: any) => {
            if (user) {
              if (user.test) {
                if (user.perfil == 'especialista' && user.aprobado == false) {
                  this.notificationService.showWarning(
                    'Tu Cuenta no esta aprobada por un Administrador',
                    'Inicio de Sesión'
                  );
                  this.spinner = false;
                  this.authService.userLogout();

                } else {
                  this.authService.isLogged = true;
                  this.notificationService.showSuccess(
                   'Inicio exitoso, redirigiendo...',
                   'Inicio de Sesión'
                 );                 
                  
                  this.spinner = false;
                  this.router.navigate(['/bienvenido']);
                }
              } else {

                if (!data?.user?.emailVerified) {
                  data?.user?.sendEmailVerification();
                  this.notificationService.showWarning(
                    'Debes verificar tu email!',
                    'Inicio de Sesión'
                  );
                  this.spinner = false;
                  this.authService.userLogout();

                } else {
                  if (user.perfil == 'especialista' && user.aprobado == false) {
                    this.notificationService.showWarning(
                      'Tu Cuenta no esta aprobada por un Administrador',
                      'Inicio de Sesión'
                    );
                    this.spinner = false;
                    this.authService.userLogout();

                  } else {
                    this.authService.isLogged = true;
                     this.notificationService.showSuccess(
                       'Inicio exitoso, redirigiendo...',
                       'Inicio de Sesión'
                     );                    
                    this.spinner = false;
                    this.router.navigate(['/bienvenido']);
                  }
                }
              }
            }
          });
        })
        .catch((error) => {
          this.spinner = false;
        });
    } else {
      this.notificationService.showWarning(
        'Debes completar todos los campos requeridos',
        'Inicio de Sesión'
      );
    }
    
  }//--------------------------------------------------------------------------------------------------

  cargarUsuario(numero : number)
  {
    {
      this.spinner = true;
      this.campoCargado = true;
      switch (numero) { 
        case 1:
          this.formLogin.setValue({
            email: 'fraugratoippette-2009@yopmail.com',
            password: '1234567',
          });
          break;                            

        case 2:
          this.formLogin.setValue({
            email: 'leuripreiveigru-4531@yopmail.com',
            password: '333321',
          });
          break;

        case 3:
          this.formLogin.setValue({
            email: 'paciente980@gmail.com',
            password: 'pacienteTest1',
          });
        break;
        
        case 4:
          this.formLogin.setValue({
            email: 'ignacio.dminstrador@gmail.com',
            password: 'admin1234',
          });
          break;
      }
      this.notificationService.showInfo(
        'Usuario cargado, puedes iniciar sesión!',
        'Inicio de Sesión'
      );
      setTimeout(() => {
        this.campoCargado = false;
        this.spinner = false;
      }, 1000);
    } //--------------------------------------------------------------------------------------------------
    

  }

}
