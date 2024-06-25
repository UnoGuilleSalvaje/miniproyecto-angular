import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estancia } from '../estancia';
import { EstanciasService } from '../services/estancias.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { PlacesService } from '../services/places.service';
import { UserService } from '../user.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, RouterModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formularioForm: FormGroup;
  estancia: any;
  currentDate = new Date();
  array: Estancia[] = [];
  miEstancia: Estancia[] = [];
  estanciaSeleccionada: Estancia | null = null;
  estanciaSeleccionadaIndex: number | null = null;

  isLoggedIn = signal(false); // Signal para el estado de autenticación
  userName = signal(''); // Signal para el nombre del usuario
  isAdmin = signal(false);
  userEmail = signal(''); // Signal para el nombre del usuario

  constructor(
    private placesService: PlacesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public estanciasService: EstanciasService,
    private userService: UserService,
    private auth: Auth
  ) {
    // Inicializa el formulario con los campos y las validaciones requeridas
    this.formularioForm = this.fb.group({
      id: [''],
      fechaHora: ['', [Validators.required, this.validateDateTimeNotOccupied.bind(this)]],
      nombre: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dias: ['', [Validators.required, Validators.min(1)]],
      correo: ['', [Validators.email]],
      personas: [''], //------------------------------------------------------------------->
      tipoHabitacion: ['', Validators.required],
      servicioDesayuno: [false],
      servicioTraslado: [false],
      servicioSpa: [false]
    });

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

        // Pasar los valores de userName y userEmail al formulario
        this.formularioForm.patchValue({
          nombre: userName,
          correo: userEmail
        });

      } else {
        // Resetear el estado de admin si no está autenticado
        this.isAdmin.set(false);
        this.userName.set('');
        this.userEmail.set('');
      }
    });
    
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.estancia = navigation.extras.state['estancia'];
      this.formularioForm.patchValue({
        precio: this.estancia.precio,
        direccion: this.estancia.direccion,
        correo: this.estancia.correo,
        nombre: this.estancia.nombre,
        id: this.estancia.id
      });
    }
    this.recuperarDatos();
    this.miEstancia = this.estanciasService.getEstancias();
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

  validateDateTimeNotOccupied(control: any) {
    const fechaHora = control.value;

    if (fechaHora) {
      const fechaHoraSeleccionada = new Date(fechaHora);
      const currentDate = new Date();
      const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');

      if (fechaHoraSeleccionada < currentDate) {
        setTimeout(() => {
          Swal.fire('Error', 'La fecha y hora seleccionadas ya pasaron.', 'error');
        }, 1000);
        return { pastDate: true };
      }

      for (const reserva of reservas) {
        const fechaHoraReservaGuardada = new Date(reserva.fechaHora);
        const estanciaReservaGuardada = reserva.estancia;

        if (this.estanciaSeleccionada && this.estanciaSeleccionada.nombre === estanciaReservaGuardada.nombre) {
          const fechaReservaExistente = new Date(fechaHoraReservaGuardada.getFullYear(), fechaHoraReservaGuardada.getMonth(), fechaHoraReservaGuardada.getDate());
          const fechaReservaSeleccionada = new Date(fechaHoraSeleccionada.getFullYear(), fechaHoraSeleccionada.getMonth(), fechaHoraSeleccionada.getDate());

          if (fechaReservaExistente.getTime() === fechaReservaSeleccionada.getTime()) {
            setTimeout(() => {
              Swal.fire('Error', 'La estancia ya ha sido reservada para esa fecha.', 'error');
            }, 2000);
            return { occupied: true };
          }
        }
      }
    }
    return null;
  }

  async guardarReservacion() {
    const reservaKey = 'reserva_' + Date.now();
  
    if (this.formularioForm.valid && this.estanciaSeleccionada) {
      const reserva = {
        ...this.formularioForm.value,
        id: reservaKey,
        estancia: this.estanciaSeleccionada
      };
  
      try {
        const response = await this.placesService.addPlace(reserva);
        console.log(response);
        Swal.fire('¡Éxito!', 'Reservación guardada con éxito.', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Hubo un problema al guardar la reservación.', 'error');
      }
    } else {
      Swal.fire('Error', 'El formulario no es válido o no se ha seleccionado una estancia.', 'error');
    }
  }
  

  recuperarDatos(): void {
    console.log("Entré");

    this.estanciasService.retornar().subscribe({
      next: this.successRequest.bind(this),
      error: (err) => {
        console.log(err);
        Swal.fire('Error', 'Hubo un problema al recuperar los datos.', 'error');
      }
    });
  }

  successRequest(data: any): void {
    console.log("data", data);
    this.array = data.estancias;
    console.log("array", this.array);
  }

  seleccionarEstancia(index: number | null): void {
    if (index !== null) {
      console.log("Estancia seleccionada:", this.miEstancia[index]);
      this.estanciaSeleccionada = this.miEstancia[index];
      this.estanciaSeleccionadaIndex = index;
      console.log("Estancia seleccionada asignada:", this.estanciaSeleccionada);
    } else {
      console.log("Ninguna estancia seleccionada");
      this.estanciaSeleccionada = null;
      this.estanciaSeleccionadaIndex = null;
    }
  }
}
