import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTarjeta]'
})
export class TarjetaDirective {

  @Input('appTarjeta') tipoTarjeta = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const img = document.createElement('img');
    const p = document.createElement('p');
    const small = document.createElement('small');
    let contenidoP: any = '';
    let contenidoSmall: any = '';

    img.style.marginTop = '2rem';
    img.style.width = '9rem';
    img.style.display = 'block';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';
    p.style.textAlign = 'center';
    p.style.color = '#fff';
    p.style.fontWeight = 'bolder';
    p.style.textShadow = '1px 1px #000';
    p.style.marginTop = '1rem';
    small.style.display = 'block';
    small.style.color = '#fff';
    small.style.fontSize = '1rem';
    small.style.textAlign = 'center';

    if (this.tipoTarjeta == 'log') {
      img.src = '../../../assets/log.png';
      contenidoP = document.createTextNode('LOG DE USUARIOS');
      contenidoSmall = document.createTextNode(
        'Detalle de los inicio de sesión de todos los usuarios'
      );
    } else if (this.tipoTarjeta == 'especialidad') {
      img.src = '../../../assets/bar-chart.png';
      contenidoP = document.createTextNode('POR ESPECIALIDAD');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por especialidad'
      );
    } else if (this.tipoTarjeta == 'dia') {
      img.src = '../../../assets/pie-chart.png';
      contenidoP = document.createTextNode('TURNOS POR DÍA');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por día'
      );
    } else if (this.tipoTarjeta == 'solicitados') {
      img.src = '../../../assets/color-palette.png';
      contenidoP = document.createTextNode('TURNOS SOLICITADOS');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por un médico en un lapso de tiempo'
      );
    } else if (this.tipoTarjeta == 'finalizados') {
      img.src = '../../../assets/graphic-designer.png';
      contenidoP = document.createTextNode('TURNOS FINALIZADOS');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos finalizados por un médico en un lapso d tiempo'
      );
    }

    p.appendChild(contenidoP);
    small.appendChild(contenidoSmall);

    this.el.nativeElement.appendChild(img);
    this.el.nativeElement.appendChild(p);
    this.el.nativeElement.appendChild(small);
  }
}
