import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss']
})
export class BienvenidoComponent {

  user: any = null;


  constructor(private router : Router,  public authService: AuthService) {}

  ngOnInit()
  {    
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        // console.log(user);
      }
    });
   }//--------------------------------------------------------------------------------------------------

  goToLogin() {
    this.router.navigate(['/login-register']);
  }//--------------------------------------------------------------------------------------------------

  goToUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }//--------------------------------------------------------------------------------------------------

}
