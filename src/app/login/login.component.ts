import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  showPhoneLogin = signal(false); // Usamos signal para controlar la visibilidad

  constructor(private userService: UserService, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl(''),
      phoneNumber: new FormControl(''),
      otp: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.userService.initializeRecaptchaVerifier('sign-in-button');
  }

  onSubmit(): void {
    const email = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;
    const phoneNumber = this.formLogin.get('phoneNumber')?.value;

    if (!email && !phoneNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Debes proporcionar un correo electrónico o un número de teléfono.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
        color: '#ffffff', // Color del texto
        customClass: {
          popup: 'swal2-elegant-popup',
          title: 'swal2-elegant-title',
          confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
          icon: 'swal2-elegant-icon'
        }
      });
      return;
    }

    if (email && password) {
      this.userService.login({ email, password })
        .then(response => {
          console.log(response);
          Swal.fire({
            title: '¡Éxito!',
            text: 'Inicio de sesión exitoso.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
            color: '#ffffff', // Color del texto
            customClass: {
              popup: 'swal2-elegant-popup',
              title: 'swal2-elegant-title',
              confirmButton: 'swal2-confirm-button-green', // Clase específica para botón verde
              icon: 'swal2-elegant-icon'
            }
          })
          this.router.navigate(['/inicio']);
        })
        .catch(error => {
          console.error(error);
          if (error.code === 'auth/invalid-email') {
            Swal.fire({
              title: 'Error',
              text: 'El correo electrónico no es válido.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
              color: '#ffffff', // Color del texto
              customClass: {
                popup: 'swal2-elegant-popup',
                title: 'swal2-elegant-title',
                confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
                icon: 'swal2-elegant-icon'
              }
            });
          } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            Swal.fire({
              title: 'Error',
              text: 'El correo electrónico o la contraseña son incorrectos.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
              color: '#ffffff', // Color del texto
              customClass: {
                popup: 'swal2-elegant-popup',
                title: 'swal2-elegant-title',
                confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
                icon: 'swal2-elegant-icon'
              }
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema con el inicio de sesión.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
              color: '#ffffff', // Color del texto
              customClass: {
                popup: 'swal2-elegant-popup',
                title: 'swal2-elegant-title',
                confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
                icon: 'swal2-elegant-icon'
              }
            });
          }
        });
    } else if (phoneNumber) {
      this.onClick(); // Inicia la autenticación con número de teléfono
    }
  }

  onClick(): void {
    const phoneNumber = this.formLogin.get('phoneNumber')?.value;
    if (!phoneNumber) {
      console.error('Phone number is required');
      Swal.fire({
        title: 'Error',
        text: 'El número de teléfono es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
        color: '#ffffff', // Color del texto
        customClass: {
          popup: 'swal2-elegant-popup',
          title: 'swal2-elegant-title',
          confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
          icon: 'swal2-elegant-icon'
        }
      });
      return;
    }

    this.userService.loginWithPhoneNumber(phoneNumber)
      .then(() => {
        console.log('OTP sent to phone');
        Swal.fire({
          title: 'Código de verificación enviado',
          text: 'Se ha enviado un código de verificación al número de telfono exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
          color: '#ffffff', // Color del texto
          customClass: {
            popup: 'swal2-elegant-popup',
            title: 'swal2-elegant-title',
            confirmButton: 'swal2-confirm-button-green', // Clase específica para botón verde
            icon: 'swal2-elegant-icon'
          }
        })
      })
      .catch((error: any) => {
        console.error('Error during login with phone number :c', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al enviar el código de verificación.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
          color: '#ffffff', // Color del texto
          customClass: {
            popup: 'swal2-elegant-popup',
            title: 'swal2-elegant-title',
            confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
            icon: 'swal2-elegant-icon'
          }
        });
      });
  }

  onVerifyOTP(): void {
    const otp = this.formLogin.get('otp')?.value;
    if (!otp) {
      console.error('OTP is required');
      Swal.fire({
        title: 'Error',
        text: 'El código de verificación y el número de teléfono son obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
        color: '#ffffff', // Color del texto
        customClass: {
          popup: 'swal2-elegant-popup',
          title: 'swal2-elegant-title',
          confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
          icon: 'swal2-elegant-icon'
        }
      });
      return;
    }

    this.userService.confirmPhoneNumber(otp)
      .then(() => {
        Swal.fire('¡Éxito!', 'Inicio de sesión exitoso.', 'success');
        this.router.navigate(['/inicio']);
      })
      .catch((error: any) => {
        console.error('Error during OTP confirmation', error);
        if (error.code === 'auth/invalid-verification-code') {
          Swal.fire({
            title: 'Error',
            text: 'El código es incorrecto.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
            color: '#ffffff', // Color del texto
            customClass: {
              popup: 'swal2-elegant-popup',
              title: 'swal2-elegant-title',
              confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
              icon: 'swal2-elegant-icon'
            }
          });
        } else {
          Swal.fire({
          title: 'Error',
          text: 'Hubo un problema con la confirmación del código.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          background: 'rgba(23, 23, 23, 0.9)', // Fondo translúcido
          color: '#ffffff', // Color del texto
          customClass: {
            popup: 'swal2-elegant-popup',
            title: 'swal2-elegant-title',
            confirmButton: 'swal2-confirm-button-red', // Clase específica para botón rojo
            icon: 'swal2-elegant-icon'
          }
        });
        }
      });
  }

  // Método para alternar la visibilidad de la autenticación por teléfono
  togglePhoneLogin(): void {
    this.showPhoneLogin.set(!this.showPhoneLogin());
  }
}
