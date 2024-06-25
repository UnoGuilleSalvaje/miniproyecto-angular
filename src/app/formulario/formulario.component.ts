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
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

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

  fechasOcupadas: Date[] = [];

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
    private auth: Auth,
    private firestore: Firestore
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
      servicioSpa: [false],
    });

    this.formularioForm.get('fechaHora')?.setValidators([
      Validators.required,
      this.validateDateTimeNotOccupied.bind(this)
    ]);

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
    this.cargarFechasOcupadas();
  }
  

  async cargarFechasOcupadas() {
    if (!this.estanciaSeleccionada) {
      console.log("No hay estancia seleccionada");
      return;
    }

    this.fechasOcupadas = [];
    const placesRef = collection(this.firestore, 'places');
    
    try {
      // Crea una consulta para filtrar por la estancia seleccionada
      const q = query(placesRef, where("estancia.id", "==", this.estanciaSeleccionada.id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data['fechaHora'] && data['dias']) {
          const fechaInicio = new Date(data['fechaHora']);
          const diasEstancia = Number(data['dias']);

          for (let i = 0; i < diasEstancia; i++) {
            const fecha = new Date(fechaInicio);
            fecha.setDate(fecha.getDate() + i);
            this.fechasOcupadas.push(fecha);
          }
        }
      });

      console.log("Fechas ocupadas cargadas para la estancia:", this.estanciaSeleccionada.id);
    } catch (error) {
      console.error("Error al cargar las fechas ocupadas:", error);
      Swal.fire('Error', 'No se pudieron cargar las fechas ocupadas para esta estancia.', 'error');
    }
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
    if (!fechaHora) return null;

    const fechaSeleccionada = new Date(fechaHora);
    const currentDate = new Date();

    // Verificar si la fecha es pasada
    if (fechaSeleccionada < currentDate) {
      Swal.fire({
        title: 'Error',
        text: 'No puedes seleccionar una fecha que ya ha pasado.',
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
      return { pastDate: true };
    }

    // Verificar si la fecha está ocupada
    const diasEstancia = this.formularioForm.get('dias')?.value || 1;
    for (let i = 0; i < diasEstancia; i++) {
      const fechaVerificar = new Date(fechaSeleccionada);
      fechaVerificar.setDate(fechaVerificar.getDate() + i);
      
      if (this.fechasOcupadas.some(fecha => 
        fecha.getFullYear() === fechaVerificar.getFullYear() &&
        fecha.getMonth() === fechaVerificar.getMonth() &&
        fecha.getDate() === fechaVerificar.getDate()
      )) {
        Swal.fire({
          title: 'Error',
          text: 'La fecha seleccionada o parte de tu estancia ya ha sido reservada.',
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
        return { occupied: true };
      }
    }

    return null;
  }

  async guardarReservacion() {
    if (this.formularioForm.valid && this.estanciaSeleccionada) {
      const reserva = {
        ...this.formularioForm.value,
        estancia: this.estanciaSeleccionada
      };

      try {
        // Añadir las nuevas fechas ocupadas
        const fechaInicio = new Date(reserva.fechaHora);
        for (let i = 0; i < reserva.dias; i++) {
          const nuevaFecha = new Date(fechaInicio);
          nuevaFecha.setDate(nuevaFecha.getDate() + i);
          this.fechasOcupadas.push(nuevaFecha);
        }

        // Guardar la reserva en Firebase
        await this.placesService.addPlace(reserva);
        Swal.fire({
          title: '!Éxito!',
          text: 'Reservación guardada con éxito.',
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
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar la reservación.',
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
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El formulario es inválido o no hay una estancia seleccionada.',
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
  

  recuperarDatos(): void {
    console.log("Entré");

    this.estanciasService.retornar().subscribe({
      next: this.successRequest.bind(this),
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al recuperar los datos.',
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

  successRequest(data: any): void {
    console.log("data", data);
    this.array = data.estancias;
    console.log("array", this.array);
  }

  seleccionarEstancia(index: number | null): void {
    if (index !== null) {
      this.estanciaSeleccionada = this.miEstancia[index];
      this.estanciaSeleccionadaIndex = index;
      this.cargarFechasOcupadas(); // Llama a cargar fechas cuando se selecciona una estancia
    } else {
      this.estanciaSeleccionada = null;
      this.estanciaSeleccionadaIndex = null;
      this.fechasOcupadas = []; // Limpia las fechas ocupadas si no hay estancia seleccionada
    }
  }
}
