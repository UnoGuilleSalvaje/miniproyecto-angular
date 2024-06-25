import { Component, OnInit, signal } from '@angular/core';
import { PlacesService } from '../services/places.service';
import Place from '../interfaces/place.interface';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
  citasAnteriores: any[] = [];
  citasFuturas: any[] = [];

  isLoggedIn = signal(false); // Signal para el estado de autenticación
  userName = signal(''); // Signal para el nombre del usuario
  isAdmin = signal(false);
  userEmail = signal(''); // Signal para el correo del usuario

  constructor(private placesService: PlacesService, private userService: UserService, private auth: Auth) {
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

        // Obtener el correo del usuario
        const userEmail = await this.userService.getUserEmail(user);
        this.userEmail.set(userEmail);
        
      } else {
        // Resetear el estado de admin si no está autenticado
        this.isAdmin.set(false);
        this.userName.set('');
        this.userEmail.set('');
      }
    });
  }

  ngOnInit(): void {
    //Firestore
    this.placesService.getPlaces().subscribe((places: Place[]) => {
      console.log("Reporte Firebase: ", places);
      this.citasAnteriores = []; // Reiniciar el arreglo
      this.citasFuturas = []; // Reiniciar el arreglo
      this.categorizeCitas(places);
    });
  }
  

  categorizeCitas(places: Place[]) {
    const now = new Date().getTime();

    places.forEach(place => {
      // Verificar que fechaHora no sea undefined
      if (place.fechaHora) {
        const citaTime = new Date(place.fechaHora).getTime();

        if (citaTime < now) {
          this.citasAnteriores.push(place);
        } else {
          this.citasFuturas.push(place);
        }
      } else {
        console.warn(`La cita con nombre ${place.nombre} no tiene una fecha y hora válida.`);
      }
    });
  }

  async borrarCita(place: Place) {
    const response = await this.placesService.deletePlace(place);
    console.log(response);
  }
}
