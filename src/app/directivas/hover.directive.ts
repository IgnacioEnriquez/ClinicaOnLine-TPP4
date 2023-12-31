import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {

  @Input('appHover') colorHover = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(this.colorHover);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover('default');
  }

  private hover(color: string) {
    if (color == 'blue') {
      this.el.nativeElement.style.background = '#1977cc';
      this.el.nativeElement.style.transition = 'background 0.5s';
      this.el.nativeElement.style.cursor = 'pointer';
    }

    if (color == 'default') {
      this.el.nativeElement.style.background = 'rgba(25, 121, 204, 0.655)';
    }
  }

}
