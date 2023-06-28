import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {

  user: any = null;

  spinner: boolean = false;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  misHorariosScreen : boolean = false;  
  hayHistorial: boolean = false;
  hayHistorialFiltrado: boolean = true;
  btnTodo: boolean = true;
  btnClinico: boolean = false;
  btnOdontologo: boolean = false;
  btnOftalmologo: boolean = false;

  historialClinico: any[] = [];
  historialClinicoFiltrado: any[] = [];
  
  fechaActual: Date = new Date();
  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

 
  ngOnInit() 
  {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        // console.log(user);
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
          this.isPaciente = false;      
          this.isEspecialista = false;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;      
          this.isEspecialista = false;
          this.authService.isAdmin = false;    

          this.authService.getHistorialesClinicos().subscribe((historial) => {
            this.historialClinico = [];
            historial.forEach((h) => {
              if (h.paciente.id == this.user.id) {
                this.historialClinico.push(h);
              }
            });    
            
            if (this.historialClinico.length > 0) {
              this.hayHistorial = true;
            } else {
              this.hayHistorial = false;
            }
          });


        } else if (this.user.perfil == 'especialista') {
          this.isEspecialista = true; 
          this.isPaciente = false;
          this.authService.isAdmin = false;          
        }
      }
    });
    
    
  }//--------------------------------------------------------------------------------------------------  

  goToMisHorarios()
  {
    // this.spinner = true;

    // setTimeout(()=>
    // {
    //   this.spinner = false; 
    // },2000)
    

    this.misHorariosScreen = true;
  }//--------------------------------------------------------------------------------------------------

  actualizarScreenEvent($event:any)
  {
     // this.spinner = true;

    // setTimeout(()=>
    // {
    //   this.spinner = false; 
    // },2000)

    this.misHorariosScreen = false;
  }//--------------------------------------------------------------------------------------------------

  verHistorialClinico() {
    this.historialClinicoFiltrado = [...this.historialClinico];
    console.log(this.historialClinicoFiltrado);
  }

  filtrarHistorialClinico(especialidad: string) {
    switch (especialidad) {
      case 'todo':
        this.btnTodo = true;
        this.btnClinico = false;
        this.btnOdontologo = false;
        this.btnOftalmologo = false;
        break;
      case 'clinico':
        this.btnTodo = false;
        this.btnClinico = true;
        this.btnOdontologo = false;
        this.btnOftalmologo = false;
        break;
      case 'odontologo':
        this.btnTodo = false;
        this.btnClinico = false;
        this.btnOdontologo = true;
        this.btnOftalmologo = false;
        break;
      case 'oftalmologo':
        this.btnTodo = false;
        this.btnClinico = false;
        this.btnOdontologo = false;
        this.btnOftalmologo = true;
        break;
    }

    this.historialClinicoFiltrado = [];
    if (especialidad == 'todo') {
      this.historialClinicoFiltrado = [...this.historialClinico];
    } else {
      for (let i = 0; i < this.historialClinico.length; i++) {
        const historial = this.historialClinico[i];
        if (historial.especialidad == especialidad) {
          this.historialClinicoFiltrado.push(historial);
        }
      }
    }

    if (this.historialClinicoFiltrado.length == 0) {
      this.hayHistorialFiltrado = false;
    } else {
      this.hayHistorialFiltrado = true;
    }
  }

  crearPDF() {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`historial_clinico.pdf`);
      });
  }

  formatearFecha(dia: any): string {
    if (dia.seconds) {
      dia = new Date(dia.seconds * 1000);
    }
    let rtn =
      dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn =
        dia.getFullYear() +
        '-' +
        (dia.getMonth() + 1) +
        '-0' +
        dia.getDate() +
        ' ' +
        dia.getHours() +
        ':';
    } else {
      rtn =
        dia.getFullYear() +
        '-' +
        (dia.getMonth() + 1) +
        '-' +
        dia.getDate() +
        ' ' +
        dia.getHours() +
        ':';
    }

    if (dia.getMinutes() < 10) {
      rtn += '0' + dia.getMinutes() + 'hs';
    } else {
      rtn += dia.getMinutes() + 'hs';
    }

    return rtn;
  }//--------------------------------------------------------------------------------------------------

}
