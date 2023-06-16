import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {

  flag_registro : boolean = false;
  form_paciente : boolean = true;
  form_especialista : boolean = false;
  spinner: boolean = false;  


   
  CambiarFlagRegistro()
  {   
    this.flag_registro = !this.flag_registro;
  }//--------------------------------------------------------------------------------------------------

  irAPaciente()
  {
    if(this.form_paciente === false)
    {
      this.spinner = true;
      this.form_especialista = false;      
  
      setTimeout(()=>
      {
        this.spinner = false;
        this.form_paciente = true;
  
      },2000);
    }

  }//--------------------------------------------------------------------------------------------------

  irAEspecialista()
  {
    if(this.form_especialista === false)
    {
      
      this.spinner = true
      this.form_paciente = false;
  
      setTimeout(()=>
      {
        this.spinner = false;
        this.form_especialista = true;      
  
      },2000);
      
    }

  }//--------------------------------------------------------------------------------------------------


}
