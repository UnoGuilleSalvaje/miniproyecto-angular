import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, User, getAuth } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private reCaptchaVerifier: RecaptchaVerifier | undefined;
  private confirmationResult: ConfirmationResult | undefined;
  
  private apiUrl = 'http://localhost:3001/api/users'; // URL de la API del servidor

  constructor(private auth: Auth, private firestore: Firestore, private http: HttpClient) {
    
  }  

  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  register({name, email, password}: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({name, email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  initializeRecaptchaVerifier(containerId: string): void {
    if (!this.reCaptchaVerifier) { //Si el recaptcha no ha sido inicializado
      this.reCaptchaVerifier = new RecaptchaVerifier(this.auth, 'sign-in-button', {'size': 'invisible'});
    }
  }

  loginWithPhoneNumber(phoneNumber: string): Promise<ConfirmationResult | void> {
    if (!this.reCaptchaVerifier) {
      console.error('RecaptchaVerifier is not initialized');
      return Promise.reject('RecaptchaVerifier is not initialized');
    }

    return signInWithPhoneNumber(this.auth, phoneNumber, this.reCaptchaVerifier)
      .then(confirmationResult => {
        this.confirmationResult = confirmationResult;
        return confirmationResult;
      })
      .catch((error: any) => {
        console.error('Error during signInWithPhoneNumber', error);
        throw error;
      });
  }

  confirmPhoneNumber(code: string): Promise<void> {
    if (!this.confirmationResult) {
      console.error('No confirmation result available');
      return Promise.reject('No confirmation result available');
    }

    return this.confirmationResult.confirm(code)
      .then(() => console.log('Phone number confirmed successfully'))
      .catch((error: any) => {
        console.error('Error confirming phone number', error);
        throw error;
      });
  }

  

}

