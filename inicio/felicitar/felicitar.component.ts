import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-felicitar',
  standalone: true,
  imports: [],
  templateUrl: './felicitar.component.html',
  styleUrls: ['./felicitar.component.css']
})
export class FelicitarComponent {
  @Input() message: string = '';

  @Output() mensajeMostrado = new EventEmitter<void>();
  constructor(private route: ActivatedRoute, private router: Router) {
    
    const state = this.route.snapshot.paramMap;
    this.message = history.state.message;
  }

  ngOnInit() {
    // despues de dos segundos regresar a la pagina de inicio
    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 5000);
  }
}