import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidoComponent } from './components/bienvenido/bienvenido.component';
import { BienvenidaModule } from './modules/bienvenida/bienvenida.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { FormAltaPacienteComponent } from './components/form-alta-paciente/form-alta-paciente.component';
import { FormAltaEspecialistaComponent } from './components/form-alta-especialista/form-alta-especialista.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { FormAltaAdministradorComponent } from './components/form-alta-administrador/form-alta-administrador.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { HorariosEspecialistaComponent } from './components/horarios-especialista/horarios-especialista.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { NavbarComponent } from './components/navbar/navbar.component';






@NgModule({
  declarations: [
    AppComponent,
    BienvenidoComponent,
    LoginRegisterComponent,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent,
    UsuariosAdminComponent,
    FormAltaAdministradorComponent,
    FormLoginComponent,
    MisTurnosComponent,
    SolicitarTurnoComponent,
    MiPerfilComponent,
    HorariosEspecialistaComponent,
    TurnosComponent,
    NavbarComponent, 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BienvenidaModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
