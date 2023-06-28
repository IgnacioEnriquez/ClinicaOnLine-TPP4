import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import firebase from 'firebase/compat/app';
import * as firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: any;
  isAdmin: boolean = false;
  isLogged: boolean = false;
  private userAux : User = new User();

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`usuarios/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );    

    this.user$.subscribe((user : any)=>
    {
      if(user)
      {
        this.userAux.email = user.email;
        this.userAux.password = user.password;    
        console.log(this.userAux);
      }
    })  
  } //--------------------------------------------------------------------------------------------------


  ngOnInit()
  { 
    
  }

  registerNewUser(newUser: User,tipo_registro : number) {

    let passwordAux = this.userAux.password;  
    let emailAux = this.userAux.email;
    
    this.angularFireAuth
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((data) => {
        data.user?.sendEmailVerification();
        this.angularFirestore
          .collection('usuarios')
          .doc(data.user?.uid)
          .set({
            id: data.user?.uid,
            perfil: newUser.perfil,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            edad: newUser.edad,
            dni: newUser.dni,
            obraSocial: newUser.obraSocial,
            especialidad: newUser.especialidad,
            email: newUser.email,
            password: newUser.password,
            imagen1: newUser.imagen1,
            imagen2: newUser.imagen2,
            aprobado: newUser.aprobado,
          })
          .then(() => {
            this.notifyService.showInfo(
              'Verifica tu email',
              'Registro exitoso'
            );   
            this.userLogout();       
            
            if(tipo_registro == 2)
            {                         
              console.log("ingreso aca");
              this.userLogin(emailAux,passwordAux);
            }       
          })
          .catch((error) => {
            this.notifyService.showError(
              this.createMessage(error.code),
              'Error'
            );
          });
                                 
      })           
      .catch((error) => {
        this.notifyService.showError(this.createMessage(error.code), 'Error');
      });
  } // -------------------------------------------------------------------------------------
  
  updateUser(userMod: any) {
    this.angularFirestore
      .doc<any>(`usuarios/${userMod.id}`)
      .update(userMod)
      .then(() => {})
      .catch((error) => {
        this.notifyService.showError('Ocurrio un error', 'Administrador');
      });
  } // -------------------------------------------------------------------------------------

  userLogout() {
    this.isAdmin = false;
    this.isLogged = false;
    this.angularFireAuth.signOut();
  } // -------------------------------------------------------------------------------------

  async userLogin(email: string, password: string) {
    try {
      return await this.angularFireAuth.signInWithEmailAndPassword(
        email,
        password
      );
    } catch (error: any) {
      console.log(error.code);
      this.notifyService.showError(
        'Email y/o contraseña invalidos',
        'Inicio fallido'
      );

      throw error;

      return null;
    }
  } // ------------------------------------------------------------------------------------- 

  async userLoginAnterior() {
    console.log(this.userAux)
  }

  private createMessage(errorCode: string): string {
    let message: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        message = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        message = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        message = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = 'Error al crear el usuario.';
        break;
    }

    return message;
  } //--------------------------------------------------------------------------------------------------

  getUsers() {
    const collection = this.angularFirestore.collection<any>('usuarios');
    return collection.valueChanges();
  } //--------------------------------------------------------------------------------------------------

  getTurnList() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  } //--------------------------------------------------------------------------------------------------
  
  updateTurnList(turn: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turn.id}`)
      .update(turn)
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        this.notifyService.showError('Ocurrio un error', 'Administrador');
      });
  } //--------------------------------------------------------------------------------------------------
  
  
  createTurnList(turn: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turn)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turn.especialista,
          turnos: turn.turnos,
        });
      });
  } //--------------------------------------------------------------------------------------------------

  getHistorialesClinicos() {
    const collection = this.angularFirestore.collection<any>(
      'historialesClinicos'
    );
    return collection.valueChanges();
  } //--------------------------------------------------------------------------------------------------

  createHistorialClinico(turn: any) {
    return this.angularFirestore
      .collection<any>('historialesClinicos')
      .add(turn)
      .then((data) => {
        this.angularFirestore
          .collection('historialesClinicos')
          .doc(data.id)
          .set({
            id: data.id,
            especialidad: turn.especialidad,
            especialista: turn.especialista,
            paciente: turn.paciente,
            fecha: turn.fecha,
            detalle: turn.detalle,
            detalleAdicional: turn.detalleAdicional,
          });
      })
      .catch((error) => {
        throw error;
      });
  }//--------------------------------------------------------------------------------------------------
}
