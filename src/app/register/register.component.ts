import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formReg: FormGroup;
  constructor(private userService: UserService, private router: Router) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void { }

  onSubmit(): void { //Metodo para enviar el formulario
    //Llamamos al método que acabamos de generar
    this.userService.register(this.formReg.value) //this.formReg.value tiene el email y el password
    .then( response => { //response es la respuesta que nos devuelve firebase
      console.log(response);
      this.router.navigate(['/login']);
    })
    .catch(error => console.log(error));
  }
}
