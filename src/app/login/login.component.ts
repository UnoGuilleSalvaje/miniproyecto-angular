import { Component, OnInit } from '@angular/core';
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
      Swal.fire('Error', 'Debe proporcionar un correo electrónico o un número de teléfono.', 'error');
      return;
    }

    if (email && password) {
      this.userService.login({ email, password })
        .then(response => {
          console.log(response);
          Swal.fire('¡Éxito!', 'Inicio de sesión exitoso.', 'success');
          this.router.navigate(['/inicio']);
        })
        .catch(error => {
          console.error(error);
          if (error.code === 'auth/invalid-email') {
            Swal.fire('Error', 'El correo electrónico no es válido.', 'error');
          } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            Swal.fire('Error', 'El correo electrónico o la contraseña son incorrectos.', 'error');
          } else {
            Swal.fire('Error', 'Hubo un problema con el inicio de sesión.', 'error');
          }
        });
    } else if (phoneNumber) {
      this.onClick(); // Inicia la autenticación con número de teléfono
    }
  }

  onClick(): void {
    const phoneNumber = this.formLogin.get('phoneNumber')?.value;
    if (!phoneNumber) {
      Swal.fire('Error', 'El número de teléfono es obligatorio.', 'error');
      return;
    }

    this.userService.loginWithPhoneNumber(phoneNumber)
      .then(() => {
        Swal.fire('OTP Enviado', 'Se ha enviado un OTP a su número de teléfono.', 'info');
      })
      .catch((error: any) => {
        console.error('Error during login with phone number', error);
        Swal.fire('Error', 'Hubo un problema al enviar el OTP.', 'error');
      });
  }

  onVerifyOTP(): void {
    const otp = this.formLogin.get('otp')?.value;
    if (!otp) {
      Swal.fire('Error', 'El código OTP es obligatorio.', 'error');
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
          Swal.fire('Error', 'El código OTP es incorrecto.', 'error');
        } else {
          Swal.fire('Error', 'Hubo un problema con la confirmación del OTP.', 'error');
        }
      });
  }
}
