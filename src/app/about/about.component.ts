import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, NgStyle, AboutComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})

export class AboutComponent {
  contactForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      gender: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.http.post('http://localhost:3000/send-email', this.contactForm.value).subscribe(
      () => {
        Swal.fire('Enviado', 'Tu mensaje ha sido enviado', 'success');
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al enviar el mensaje', 'error');
        this.isSubmitting = false;
      }
    );
  }
}
