import { Component } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.css'
})
export class AyudaComponent {
  faqs = [
    {
      id: 1,
      question: '¿Cómo puedo reservar una estancia en StayInn?',
      answer: 'Para reservar una estancia en StayInn, sigue estos pasos: 1) Busca la propiedad que te interese, 2) Verifica la disponibilidad en las fechas deseadas, 3) Haz clic en "Reservar", 4) Completa tus datos y realiza el pago. Recibirás una confirmación por correo electrónico.',
      isOpen: false
    },
    {
      id: 2,
      question: '¿Cuál es la política de cancelación de StayInn?',
      answer: 'Nuestra política de cancelación varía según la propiedad. Generalmente, ofrecemos reembolso completo si cancelas con al menos 48 horas de anticipación. Consulta los detalles específicos en la página de cada propiedad.',
      isOpen: false
    },
    {
      id: 3,
      question: '¿Cómo puedo contactar al anfitrión de una propiedad?',
      answer: 'Una vez que hayas realizado una reserva, podrás contactar al anfitrión a través de nuestra plataforma. Ve a "Mis reservas" y selecciona la opción "Contactar al anfitrión".',
      isOpen: false
    },
    {
      id: 4,
      question: '¿StayInn ofrece seguro para los huéspedes?',
      answer: 'Sí, ofrecemos un seguro básico para todos los huéspedes. También tienes la opción de adquirir un seguro adicional al momento de hacer tu reserva para mayor tranquilidad.',
      isOpen: false
    },
    {
      id: 5,
      question: '¿Cómo funciona el proceso de check-in y check-out?',
      answer: 'El proceso varía según la propiedad. Normalmente, recibirás instrucciones detalladas para el check-in por correo electrónico antes de tu llegada. El check-out suele ser simple, siguiendo las instrucciones del anfitrión.',
      isOpen: false
    },
    {
      id: 6,
      question: '¿Qué debo hacer si tengo un problema durante mi estancia?',
      answer: 'Si tienes algún problema durante tu estancia, contacta inmediatamente al anfitrión a través de nuestra plataforma. Si no puedes resolverlo con el anfitrión, nuestro equipo de soporte 24/7 está disponible para ayudarte.',
      isOpen: false
    },
    {
      id: 7,
      question: '¿Cómo puedo dejar una reseña después de mi estancia?',
      answer: 'Después de tu estancia, recibirás un correo electrónico invitándote a dejar una reseña. También puedes ir a "Mis viajes" en tu cuenta y seleccionar la opción "Dejar una reseña" para la propiedad correspondiente.',
      isOpen: false
    },
    {
      id: 8,
      question: '¿StayInn verifica las propiedades listadas?',
      answer: 'Sí, todas las propiedades listadas en StayInn pasan por un proceso de verificación para asegurar que cumplen con nuestros estándares de calidad y seguridad.',
      isOpen: false
    },
    {
      id: 9,
      question: '¿Puedo modificar una reserva ya confirmada?',
      answer: 'Dependiendo de la política del anfitrión, podrías modificar tu reserva. Ve a "Mis reservas" y selecciona la opción "Modificar reserva". Si no es posible hacerlo directamente, contacta al anfitrión para discutir las opciones.',
      isOpen: false
    },
    {
      id: 10,
      question: '¿Cómo puedo convertirme en anfitrión en StayInn?',
      answer: 'Para convertirte en anfitrión, ve a nuestra página principal y haz clic en "Conviértete en anfitrión". Sigue los pasos para registrar tu propiedad. Nuestro equipo revisará tu solicitud y te contactará para los siguientes pasos.',
      isOpen: false
    }
  ];

  togglePanel(id: number) {
    this.faqs = this.faqs.map(faq => 
      
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false }
    );
  }
}
