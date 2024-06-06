import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  ngOnInit() {
    this.loadScript('assets/js/navbar.js');
  }

  private loadScript(scriptUrl: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = scriptUrl;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  phoneNumber: string = ''; // Asegúrate de asignar el número de teléfono antes de usarlo

  // Paso de parámetros del nombre de la estancia a buscar
  constructor(private router:Router, private userservice: UserService) {}

  onClick () {
    this.userservice.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error: any) => console.log(error));
  }

  buscarUnaEstancia(nombre:string) {
    this.router.navigate(['/buscador', nombre]);
  }
  
}
