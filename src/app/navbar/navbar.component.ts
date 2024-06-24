import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // styleUrl -> styleUrls
})
export class NavbarComponent implements OnInit {
  isLoggedIn = signal(false); // Signal para el estado de autenticación
  isAdmin = signal(false);
  userName = signal(''); // Signal para el nombre del usuario

  constructor(private router: Router, private userService: UserService, private auth: Auth) {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, async (user) => {
      const isLoggedIn = !!user;
      this.isLoggedIn.set(isLoggedIn);

      if (isLoggedIn && user) {
        // Verificar si el usuario es admin
        const admin = await this.userService.isAdmin(user);
        this.isAdmin.set(admin);

        // Obtener el nombre del usuario
        const userName = await this.userService.getUserName(user);
        this.userName.set(userName);
      } else {
        // Resetear el estado de admin si no está autenticado
        this.isAdmin.set(false);
        this.userName.set('');
      }
    });
  }

  ngOnInit() {
    this.loadScript('assets/js/navbar.js');

    // Escuchar cambios en el estado de autenticación
    this.userService.isAuthenticated().subscribe(isAuth => {
      this.isLoggedIn.set(isAuth);
    });
  }

  private loadScript(scriptUrl: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = scriptUrl;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  buscarUnaEstancia(nombre: string) {
    this.router.navigate(['/buscador', nombre]);
  }
}
