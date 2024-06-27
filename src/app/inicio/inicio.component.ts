import { Component, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomseguroPipe } from '../domseguro.pipe';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FelicitarComponent } from './felicitar/felicitar.component';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QrServiceService } from '../qr-service.service';

@NgModule ({
  imports: [
    MatSlideToggleModule,
  ]
})
class AppModule {}

export class MiComponenteComponent {
  isMagic: boolean = false;

  toggleMagic() {
    this.isMagic = !this.isMagic;
  }
}


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatCardModule, NgStyle, RouterOutlet, DomseguroPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  userEmail: string = '';
  message: string = '';

  qrData: any;
  qrCode!: string;

  @ViewChild(FelicitarComponent, { static: false }) felicitarComponent!: FelicitarComponent;

  updateEmail() {
    console.log('Email actualizado:', this.userEmail);
  }
  video: string = "QXt21aGi_nQ?si=_c61Gdel1By3kTDI";

  constructor(private router: Router, private qrService: QrServiceService) {}

  ngOnInit() {
    this.qrService.getQrData().subscribe((response) => {
      this.qrData = response.data;
      this.qrCode = response.qr;
    });
  }

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

