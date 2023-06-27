import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

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

  misHorariosScreen = false;  

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
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;          
        } else if (this.user.perfil == 'especialista') {
          this.isEspecialista = true;         
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

}
