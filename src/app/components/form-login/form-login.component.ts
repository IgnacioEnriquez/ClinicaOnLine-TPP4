import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
})
export class FormLoginComponent {

  userLog: any = null;
  formLogin: FormGroup;
  spinner: boolean = false;
  userLogin: User = new User();
  campoCargado: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  } //--------------------------------------------------------------------------------------------------

  loginUser() {
    if (this.formLogin.valid) {
      this.spinner = true;
      this.userLogin.email = this.formLogin.getRawValue().email;
      this.userLogin.password = this.formLogin.getRawValue().password;
      this.authService
        .userLogin(this.userLogin.email, this.userLogin.password)
        .then(async (data: any) => {        
          let subscripcion = this.authService.user$.subscribe((user: any) => {
            if (user) {                          
              if (!data?.user?.emailVerified) {
                
                data?.user?.sendEmailVerification();
                this.notificationService.showWarning(
                  'Debes verificar tu email!',
                  'Inicio de Sesión'
                );
                this.spinner = false;              
                subscripcion.unsubscribe();
                this.authService.userLogout();
              } else {
                if (user.perfil == 'especialista' && user.aprobado == false) {
                
                  this.notificationService.showWarning(
                    'Tu Cuenta no esta aprobada por un Administrador',
                    'Inicio de Sesión'
                  );
                  this.spinner = false;
                  subscripcion.unsubscribe();
                  this.authService.userLogout();
                } else {
                  this.authService.isLogged = true;
                  this.notificationService.showSuccess(
                    'Inicio exitoso, redirigiendo...',
                    'Inicio de Sesión'
                  );                          
                  this.spinner = false;  
                  this.userLog = user;  
                  this.authService.createUserLog(this.userLog);              
                  this.router.navigate(["bienvenido"]);
                  subscripcion.unsubscribe();
                  
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
  } //--------------------------------------------------------------------------------------------------

  cargarUsuario(numero: number) {
    {
      this.spinner = true;
      this.campoCargado = true;
      switch (numero) {
        case 1:
          this.formLogin.setValue({
            email: 'gapputitanneu-9916@yopmail.com',
            password: '444333',
          });
          break;

        case 2:
          this.formLogin.setValue({
            email: 'frivovipoda-3463@yopmail.com',
            password: '333444',
          });
          break;

        case 3:
          this.formLogin.setValue({
            email: 'gawalouture-9038@yopmail.com',
            password: '333444',
          });
          break;

        case 4:
          this.formLogin.setValue({
            email: 'naugaweiweveu-7825@yopmail.com',
            password: '234123',
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
