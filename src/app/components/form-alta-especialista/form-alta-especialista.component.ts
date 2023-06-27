import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-form-alta-especialista',
  templateUrl: './form-alta-especialista.component.html',
  styleUrls: ['./form-alta-especialista.component.scss']
})
export class FormAltaEspecialistaComponent {

  @Input() tipoRegistro: any = 1;
  formEspecialista: FormGroup;
  newEspecialista: User = new User();  
  especialidad: boolean = false;
  spinner: boolean = false;
  captcha: string = '';

  constructor(private formBuilder: FormBuilder,
    private angularFireStorage: AngularFireStorage,
    private notificationService: NotificationService,
    private authService: AuthService) 
  {

    this.formEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: ['', [Validators.required]], 
    });      
    this.captcha = this.generateRandomString(6);
  } //--------------------------------------------------------------------------------------------------

   registrarEspecialista() {
    if (this.formEspecialista.valid) {

      if (
        this.captcha.toLocaleLowerCase().trim() ==
        this.formEspecialista.getRawValue().captcha.toLocaleLowerCase().trim()
      )
      {
        if (this.newEspecialista.imagen1 != '') {
          this.spinner = true;
          this.newEspecialista.perfil = 'especialista';
          this.newEspecialista.nombre =
            this.formEspecialista.getRawValue().nombre;
          this.newEspecialista.apellido =
            this.formEspecialista.getRawValue().apellido;
          this.newEspecialista.edad = this.formEspecialista.getRawValue().edad;
          this.newEspecialista.dni = this.formEspecialista.getRawValue().dni;
          this.newEspecialista.especialidad =
          {
            duracionTurno: 30,
            diasTurnos : ["lunes"],
            nombre : this.formEspecialista.getRawValue().especialidad
          }
            
          this.newEspecialista.email =
            this.formEspecialista.getRawValue().email;
          this.newEspecialista.password =
            this.formEspecialista.getRawValue().password;
            console.log(this.tipoRegistro);
          this.authService.registerNewUser(this.newEspecialista,this.tipoRegistro);
          this.authService.userLogout();          

          setTimeout(() => {
            this.spinner = false;
            this.formEspecialista.reset();
            this.formEspecialista.controls['especialidad'].setValue("clinico");        
            this.newEspecialista = new User();
          }, 2000);
        } else {
          this.notificationService.showWarning(
            'Debes elegir una imágen para tu perfil',
            'Registro Especialista'
          );
        }      

      }
      else {
        this.notificationService.showWarning(
          'El CAPTCHA no coincide',
          'Registro Paciente'
        );
        this.captcha = this.generateRandomString(6);
      }
    } else {
      this.notificationService.showWarning(
        'Debes completar todos los campos requeridos',
        'Registro Especialista'
      );
    }
  } //--------------------------------------------------------------------------------------------------

  async uploadImage($event: any) {
    this.spinner = true;
    const file = $event.target.files[0];
    const path = 'img ' + Date.now() + Math.random() * 10;
    const reference = this.angularFireStorage.ref(path);
    await reference.put(file).then(async () => {
      await reference.getDownloadURL().subscribe((urlImg) => {
        this.newEspecialista.imagen1 = urlImg;
        this.spinner = false;
      });
    });
  } //--------------------------------------------------------------------------------------------------

  addEspecialidad() {
    if (this.formEspecialista.getRawValue().especialidad == '') {
      this.especialidad = true;
    } else {
      this.especialidad = false;
    }
  } //--------------------------------------------------------------------------------------------------

  generateRandomString(num: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result1;
  }//--------------------------------------------------------------------------------------------------

}
