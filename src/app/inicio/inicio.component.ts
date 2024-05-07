import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomseguroPipe } from '../domseguro.pipe';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatCardModule, NgStyle, RouterOutlet, DomseguroPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  userEmail: string = '';

  updateEmail() {
    console.log('Email actualizado:', this.userEmail);
  }
  video: string = "QXt21aGi_nQ?si=_c61Gdel1By3kTDI";
}
