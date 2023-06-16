import { Component } from '@angular/core';
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

  formEspecialista: FormGroup;
  newEspecialista: User = new User();  
  especialidad: boolean = false;
  spinner: boolean = false;

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
    });      
    
  } //--------------------------------------------------------------------------------------------------

   registrarEspecialista() {
    if (this.formEspecialista.valid) {
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
            this.formEspecialista.getRawValue().especialidad;
          this.newEspecialista.email =
            this.formEspecialista.getRawValue().email;
          this.newEspecialista.password =
            this.formEspecialista.getRawValue().password;
          this.authService.registerNewUser(this.newEspecialista);
          setTimeout(() => {
            this.spinner = false;
            this.formEspecialista.reset();
            this.addEspecialidad();
            this.newEspecialista = new User();
          }, 2000);
        } else {
          this.notificationService.showWarning(
            'Debes elegir una imágen para tu perfil',
            'Registro Especialista'
          );
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


}
