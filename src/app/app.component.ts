import { Component } from '@angular/core';
import { ChildrenOutletContexts, Route, Router } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'clinica-OnLine';  
  
  constructor(private router : Router,private contexts: ChildrenOutletContexts) {}

  goToBienvenido()
  {
    this.router.navigate(['/bienvenido'])
  } //--------------------------------------------------------------------------------------------------

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
  
}
