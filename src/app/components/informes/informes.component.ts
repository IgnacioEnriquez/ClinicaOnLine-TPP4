import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent {

  spinner: boolean = false;
  
  //@ts-ignore
  chartPorEspecialidad: Chart;

  listaLogs: any[] = [];
  listaTurnos: any[] = [];

  btn7Dias: boolean = false;
  btn15Dias: boolean = true;
  banderaChartSolicitados: boolean = true;

  btn7DiasFinalizado: boolean = false;
  btn15DiasFinalizado: boolean = true;
  banderaChartFinalizados = true;

  constructor(private authService: AuthService)
  {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );
    Chart.register(...registerables);
    
  }

  
  ngOnInit()
  {
    this.authService.getUsersLog().subscribe((logs) => {
      this.listaLogs = logs;
      this.listaLogs.forEach((l) => {
        l.fecha = new Date(l.fecha.seconds * 1000);
      });
    });

    this.authService.getTurnList().subscribe((turnos) => {
      this.listaTurnos = [];
      for (let i = 0; i < turnos.length; i++) {
        const turnosEspecialista = turnos[i].turnos;
        turnosEspecialista.forEach((t: any) => {
          if (t.estado != 'disponible') {
            this.listaTurnos.push(t);
          }
        });
      }
      this.generarChartTurnosEspecialidad(); 
      this.generarChartTurnosPorDia();
      this.generarChartTurnosSolicitadosPorMedico(this.listaTurnos);
      this.generarChartTurnosFinalizadosPorMedico(this.listaTurnos);
      console.log(this.listaTurnos);       
    });
  }

   
  // LOGS DE USUARIOS
  descargarPDFLogs() {
    const DATA = document.getElementById('pdflogs');
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
        docResult.save(`logs_usuarios.pdf`);
      });
  }

  descargarExcelLogs() {
    this.exportAsExcelFile(this.listaLogs, 'logUsuarios');
  }//---------------------------------------------------------------------------------


  //CHART TURNOS POR ESPECIALIDAD
  generarChartTurnosEspecialidad() {
    const ctx = (<any>(
      document.getElementById('turnosPorEspecialidad')
    )).getContext('2d');

    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#55ff9c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnos = [0, 0, 0];
    this.listaTurnos.forEach((t) => {
      if (t.especialidad == 'clinico') {
        listaTurnos[0]++;
      } else if (t.especialidad == 'odontologo') {
        listaTurnos[1]++;
      } else if (t.especialidad == 'oftalmologo') {
        listaTurnos[2]++;
      }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CLINICO', 'ODONTOLOGO', 'OFTALMOLOGO'],
        datasets: [
          {
            label: undefined,
            data: listaTurnos,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos por especialidad',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosPorEspecialidad() {
    const DATA = document.getElementById('pdfTurnosPorEspecialidad');
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
        docResult.save(`turnos_por_especialidad.pdf`);
      });
  }

  descargarExcelTurnosPorEspecialidad() {
    const listaTurnos = [
      { especialidad: 'clinico', turnos: 0 },
      { especialidad: 'odontologo', turnos: 0 },
      { especialidad: 'oftalmologo', turnos: 0 },
    ];
    this.listaTurnos.forEach((t) => {
      if (t.especialidad == 'clinico') {
        listaTurnos[0].turnos++;
      } else if (t.especialidad == 'odontologo') {
        listaTurnos[1].turnos++;
      } else if (t.especialidad == 'oftalmologo') {
        listaTurnos[2].turnos++;
      }
    });
    this.exportAsExcelFile(listaTurnos, 'turnosPorEspecialidad');
  } //---------------------------------------------------------------------------------

  
  //CHART TURNOS POR DIA
  generarChartTurnosPorDia() {
    const ctx = (<any>document.getElementById('turnosPorDia')).getContext('2d');

    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#55ff9c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosPorDia = [0, 0, 0, 0, 0, 0];
    this.listaTurnos.forEach((t) => {
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        listaTurnosPorDia[0]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        listaTurnosPorDia[1]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        listaTurnosPorDia[2]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        listaTurnosPorDia[3]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
        listaTurnosPorDia[4]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        listaTurnosPorDia[5]++;
      }
    });

    console.log(listaTurnosPorDia);

    //@ts-ignore
    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosPorDia,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos por día',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosPorDia() {
    const DATA = document.getElementById('pdfTurnosPorDia');
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
        docResult.save(`turnos_por_dia.pdf`);
      });
  }

  descargarExcelTurnosPorDia() {
    const listaTurnosPorDia = [
      {
        Fecha: new Date(),
        Lunes: 0,
        Martes: 0,
        Miercoles: 0,
        Jueves: 0,
        Viernes: 0,
        Sabado: 0,
      },
    ];
    this.listaTurnos.forEach((t) => {
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        
        listaTurnosPorDia[0].Lunes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        
        listaTurnosPorDia[0].Martes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        
        listaTurnosPorDia[0].Miercoles++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        
        listaTurnosPorDia[0].Jueves++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
       
        listaTurnosPorDia[0].Viernes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        
        listaTurnosPorDia[0].Sabado++;
      }
    });
    this.exportAsExcelFile(listaTurnosPorDia, 'turnosPorDia');
  }//---------------------------------------------------------------------------------

  
  //CHAR SOLICITADOS POR MEDICO
  generarChartTurnosSolicitadosPorMedico(listado: any[]) {
    const ctx = (<any>(
      document.getElementById('turnosSolicitadosPorMedico')
    )).getContext('2d');

    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#55ff9c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosSolicitadosPorMedico = [0, 0, 0];
    listado.forEach((t) => {
      if (
        t.especialista.email == 'gapputitanneu-9916@yopmail.com' &&
        t.estado == 'solicitado'
      ) {
        listaTurnosSolicitadosPorMedico[0]++;
      } else if (
        t.especialista.email == 'frivovipoda-3463@yopmail.com' &&
        t.estado == 'solicitado'
      ) {
        listaTurnosSolicitadosPorMedico[1]++; 
        }     
    });

    //@ts-ignore
    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Javier Schultz', 'Sergio Rodriguez'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosSolicitadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos solicitados por médico',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosSolicitadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosSolicitadosPorMedico');
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
        docResult.save(`turnosSolicitadosPorMedico.pdf`);
      });
  }

  descargarExcelTurnosSolicitadosPorMedico() {
    let listaTurnosSolicitadosPorMedico = [
      {
        Fecha: new Date(),
        Especialista1: 0,
        Especialista2: 0,
        Juan_Perez: 0,
      },
    ];
    if (this.btn15Dias) {
      this.listaTurnos.forEach((t) => {
        if (
          t.especialista.email == 'especialistaTest1@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.email == 'especialistaTest2@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista2++;
        } else if (
          t.especialista.email == 'juanperez@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Juan_Perez++;
        }
      });
    } else {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
      const listadoFiltrado: any[] = [];
      this.listaTurnos.forEach((t) => {
        if (
          new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
          t.estado == 'solicitado'
        ) {
          listadoFiltrado.push(t);
        }
      });

      listadoFiltrado.forEach((t) => {
        if (
          t.especialista.email == 'especialistaTest1@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.email == 'especialistaTest2@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista2++;
        } else if (
          t.especialista.email == 'juanperez@mail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Juan_Perez++;
        }
      });
    }
    this.exportAsExcelFile(
      listaTurnosSolicitadosPorMedico,
      'turnosSolicitadosPorMedico'
    );
  }

  filtrarTurnosPorDias(cantidadDias: number) {
    this.banderaChartSolicitados = false;
    if (cantidadDias == 7) {
      this.btn7Dias = true;
      this.btn15Dias = false;
    } else if (cantidadDias == 15) {
      this.btn7Dias = false;
      this.btn15Dias = true;
    }
    setTimeout(() => {
      this.banderaChartSolicitados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
              futureDate.getTime() &&
            t.estado == 'solicitado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosSolicitadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }//---------------------------------------------------------------------------------

  // CHART FINALIZADOS POR MEDICO
  generarChartTurnosFinalizadosPorMedico(listado: any[]) {
    const ctx = (<any>(
      document.getElementById('turnosFinalizadosPorMedico')
    )).getContext('2d');

    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#55ff9c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosFinalizadosPorMedico = [0, 0, 0];
    listado.forEach((t) => {
      if (
        t.especialista.email == 'gapputitanneu-9916@yopmail.com' &&
        t.estado == 'realizado'
      ) {
        listaTurnosFinalizadosPorMedico[0]++;
      } else if (
        t.especialista.email == 'frivovipoda-3463@yopmail.com' &&
        t.estado == 'realizado'
      ) {
        listaTurnosFinalizadosPorMedico[1]++;
      }
    });

    //@ts-ignore
    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Javier Schultz', 'Sergio Rodriguez'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosFinalizadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos finalizados por médico',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarExcelTurnosFinalizadosPorMedico() {
    let listaTurnosFinalizadosPorMedico = [
      {
        Fecha: new Date(),
        Especialista1: 0,
        Especialista2: 0,
        Juan_Perez: 0,
      },
    ];
    if (this.btn15DiasFinalizado) {
      this.listaTurnos.forEach((t) => {
        if (
          t.especialista.email == 'especialistaTest1@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.email == 'especialistaTest2@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista2++;
        } else if (
          t.especialista.email == 'juanperez@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Juan_Perez++;
        }
      });
    } else {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
      const listadoFiltrado: any[] = [];
      this.listaTurnos.forEach((t) => {
        if (
          new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
          t.estado == 'realizado'
        ) {
          listadoFiltrado.push(t);
        }
      });

      listadoFiltrado.forEach((t) => {
        if (
          t.especialista.email == 'especialistaTest1@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.email == 'especialistaTest2@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista2++;
        } else if (
          t.especialista.email == 'juanperez@mail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Juan_Perez++;
        }
      });
    }
    this.exportAsExcelFile(
      listaTurnosFinalizadosPorMedico,
      'turnosFinalizadosPorMedico'
    );
  }

  descargarPDFTurnosFinalizadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosFinalizadosPorMedico');
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
        docResult.save(`turnosFinalizadosPorMedico.pdf`);
      });
  }

  filtrarTurnosPorDiasFinalizados(cantidadDias: number) {
    this.banderaChartFinalizados = false;
    if (cantidadDias == 7) {
      this.btn7DiasFinalizado = true;
      this.btn15DiasFinalizado = false;
    } else if (cantidadDias == 15) {
      this.btn7DiasFinalizado = false;
      this.btn15DiasFinalizado = true;
    }
    setTimeout(() => {
      this.banderaChartFinalizados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
              futureDate.getTime() &&
            t.estado == 'realizado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosFinalizadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }//---------------------------------------------------------------------------------



  // UTILES
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
