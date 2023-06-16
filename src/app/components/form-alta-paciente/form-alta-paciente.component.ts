import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-form-alta-paciente',
  templateUrl: './form-alta-paciente.component.html',
  styleUrls: ['./form-alta-paciente.component.scss']
})
export class FormAltaPacienteComponent {

  formPaciente: FormGroup;
  newPaciente: User = new User(); 
  spinner: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private angularFireStorage: AngularFireStorage,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      obraSocial: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],     
    });   
  } //--------------------------------------------------------------------------------------------------

  registrarPaciente()
  {
    if (this.formPaciente.valid) 
    {
      if (this.newPaciente.imagen1 != '' && this.newPaciente.imagen2 != '')
      {
        this.spinner = true;
        this.spinner = true;
          this.newPaciente.perfil = 'paciente';
          this.newPaciente.nombre = this.formPaciente.getRawValue().nombre;
          this.newPaciente.apellido = this.formPaciente.getRawValue().apellido;
          this.newPaciente.edad = this.formPaciente.getRawValue().edad;
          this.newPaciente.dni = this.formPaciente.getRawValue().dni;
          this.newPaciente.obraSocial =
            this.formPaciente.getRawValue().obraSocial;
          this.newPaciente.email = this.formPaciente.getRawValue().email;
          this.newPaciente.password = this.formPaciente.getRawValue().password;
          this.authService.registerNewUser(this.newPaciente);
        setTimeout(() => {
          this.spinner = false;
          this.formPaciente.reset();
          this.newPaciente = new User();
        }, 2000);
      }
      else
      {
        this.notificationService.showWarning(
          'Debes agregar 2 imagenes para su perfil',
          'Registro Paciente'
        );
      }
      

    } else {
      this.notificationService.showWarning(
        'Debes completar todos los campos requeridos',
        'Registro Paciente'
      );
    }
  }  //--------------------------------------------------------------------------------------------------

  async uploadImage($event: any, option: number) {
    this.spinner = true;
    const file = $event.target.files[0];
    const path = 'img ' + Date.now() + Math.random() * 10;
    const reference = this.angularFireStorage.ref(path);
    await reference.put(file).then(async () => {
      await reference.getDownloadURL().subscribe((urlImg) => {
        this.spinner = false;
        if (option == 1) {
          this.newPaciente.imagen1 = urlImg;
        } else if (option == 2) {
          this.newPaciente.imagen2 = urlImg;
        }
      });
    });
  } //--------------------------------------------------------------------------------------------------

  
}
