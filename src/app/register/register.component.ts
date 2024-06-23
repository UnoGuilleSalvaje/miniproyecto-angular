import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formReg: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    // Inicializamos el formulario reactivo con validaciones
    this.formReg = new FormGroup({
      // Campo nombre: requerido, longitud mínima de 3 y máxima de 50 caracteres
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      // Campo email: requerido y debe tener formato de email
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      // Campo usuario: requerido, longitud mínima de 3 y máxima de 20 caracteres
      usuario: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
      // Campo contraseña: requerido
      password: new FormControl('', Validators.required),
      // Campo confirmación de contraseña: requerido
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.formReg.valid) {
      this.userService.register(this.formReg.value)
      .then(response => {
        console.log(response);
        // Mostrar SweetAlert cuando las contraseñas coinciden
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada correctamente.',
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
        }).then(() => {
          // Navegar a /inicio después de que el usuario cierre el SweetAlert
          this.router.navigate(['/inicio']);
        });
      })
      .catch(error => console.log(error));
    } else {
      // Mostrar SweetAlerts para cada caso de validación no cumplida
      if (this.formReg.get('nombre')?.errors?.['required']) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre es obligatorio.',
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
      } else if (this.formReg.get('nombre')?.errors?.['minlength'] || this.formReg.get('nombre')?.errors?.['maxlength']) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre debe tener entre 3 y 50 caracteres.',
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
      } else if (this.formReg.get('email')?.errors?.['required']) {
        Swal.fire({
          title: 'Error',
          text: 'El correo es obligatorio.',
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
      } else if (this.formReg.get('email')?.errors?.['email']) {
        Swal.fire({
          title: 'Error',
          text: 'El correo debe tener un formato válido.',
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
      } else if (this.formReg.get('usuario')?.errors?.['required']) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre de usuario es obligatorio.',
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
      } else if (this.formReg.get('usuario')?.errors?.['minlength'] || this.formReg.get('usuario')?.errors?.['maxlength']) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre de usuario debe tener entre 3 y 20 caracteres.',
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
      } else if (this.formReg.get('password')?.errors?.['required']) {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña es requerida.',
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
      } else if (this.formReg.get('password')?.errors?.['minlength']) {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña debe tener al menos 6 caracteres.',
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
      } else if (this.formReg.hasError('passwordsDoNotMatch')) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
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
    }
  }

  // Validación personalizada para verificar que las contraseñas coincidan
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }
}
