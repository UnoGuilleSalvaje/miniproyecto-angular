import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FelicitarComponent } from './felicitar/felicitar.component';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  userEmail: string = '';
  message: string = '';

  @ViewChild(FelicitarComponent, { static: false }) felicitarComponent!: FelicitarComponent;

  
  updateEmail() {
    console.log('Email actualizado:', this.userEmail);
  }

  constructor(private router: Router) {}

  suscribir() {
    this.message = 'Gracias por suscribirte, te mandaremos un correo con las mejores ofertas. Regresando al menu principal...';
    // Al hacer clic en el botón, redirigimos a FelicitarComponent y pasamos el mensaje
    this.router.navigate(['/felicitar'], { state: { message: this.message } });
  }

  onMensajeMostrado() {
    console.log('El mensaje de felicitación ha sido mostrado.');
    // Realiza alguna acción adicional si es necesario
  }
}
