import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private userService: UserService) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      otp: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.userService.initializeRecaptchaVerifier('sign-in-button');
  }

  onSubmit(): void {

      this.userService.login(this.formLogin.value)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));

  }

  onClick(): void {
    const phoneNumber = this.formLogin.get('phoneNumber')?.value;
    if (!phoneNumber) {
      console.error('Phone number is required');
      return;
    }

    this.userService.loginWithPhoneNumber(phoneNumber)
      .then(() => {
        console.log('OTP sent to phone');
      })
      .catch((error: any) => console.error('Error during login with phone number', error));
  }

  onVerifyOTP(): void {
    const otp = this.formLogin.get('otp')?.value;
    if (!otp) {
      console.error('OTP is required');
      return;
    }

    this.userService.confirmPhoneNumber(otp)
      .then(() => {
        console.log('Login successful');
      })
      .catch((error: any) => console.error('Error during OTP confirmation', error));
  }
}
