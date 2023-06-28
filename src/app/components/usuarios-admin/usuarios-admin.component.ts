import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.scss']
})
export class UsuariosAdminComponent {

  usersList: any[] = [];
  historialClinico: any[] = [];
  historialActivo: any[] = [];

  listadoUsuarios: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  spinner: boolean = true;
  
  hayHistorial: boolean = false;  
  tipoRegistro = 2;
  

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit()
  {
    this.authService.getUsers().subscribe((users) => {
      this.spinner = false;
      if (users) {
        this.usersList = users;
      }    
      this.spinner = false;
      this.listadoUsuarios = true; 
      console.log(this.usersList);      
    });            
  } //--------------------------------------------------------------------------------------------------

  updateUser(user: User, option: number)
  {
    if (user.perfil == 'especialista') {
      if (option == 1) {
        user.aprobado = true;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Habilitado',
          'Administrador'
        );
      } else if (option == 2) {
        user.aprobado = false;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Deshabilitado',
          'Administrador'
        );
      }
    }
    
  } //--------------------------------------------------------------------------------------------------

  mostrarCreacionPaciente()
  {
    this.notificationService.showWarning("Al crear un usuario en esta parte del sistema, se volvera al inicio","Aviso de Registro");
    this.formPaciente = true;
    this.formEspecialista = false;
    this.formAdministrador = false;
    this.listadoUsuarios = false; 
  } //--------------------------------------------------------------------------------------------------

  cambiarFormulario(numero : number)
  {
    switch(numero)
    {
      case 1:
        this.formPaciente = false;
        this.formEspecialista = false;
        this.formAdministrador = true;     
      break;

      case 2:
        this.formPaciente = true;
        this.formEspecialista = false;
        this.formAdministrador = false;     
      break;

      case 3:
        this.formPaciente = false;
        this.formEspecialista = true;
        this.formAdministrador = false;     
      break;
    }

  } //--------------------------------------------------------------------------------------------------

  volverAListado()
  {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
    this.listadoUsuarios = true; 
    
  } //--------------------------------------------------------------------------------------------------

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
  }

  descargarExcel() {

    let listaUsuariosAux : any = [];

    this.usersList.forEach(usuario => {      
        listaUsuariosAux.push(usuario);           
    });

    listaUsuariosAux.forEach((usuarioAux : any) => {

      if(usuarioAux.perfil === "especialista")
      {        
        usuarioAux.especialidad = usuarioAux.especialidad.nombre;        
      }
    });

    console.log(listaUsuariosAux);
    console.log(this.usersList);

    this.exportAsExcelFile(this.usersList, 'listadoUsuarios');
    this.notificationService.showSuccess(
      'Listado de Usuarios descargado',
      'Usuarios'
    );
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  
}
