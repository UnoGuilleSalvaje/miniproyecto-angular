import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, RecaptchaVerifier, signInWithPhoneNumber,
  ConfirmationResult, User, onAuthStateChanged
} from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private reCaptchaVerifier: RecaptchaVerifier | undefined;
  private confirmationResult: ConfirmationResult | undefined;
  private apiUrl = 'http://localhost:3001/api/users'; // URL de la API del servidor
  private authState = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth, private firestore: Firestore, private http: HttpClient) {
    onAuthStateChanged(this.auth, user => {
      this.authState.next(!!user);
    });
  }

  // Comprobar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  async register({ nombre, usuario, email, password }: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guarda los datos adicionales y el rol en Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), {
        uid: user.uid,
        nombre: nombre,
        usuario: usuario,
        email: email,
        role: 'user' // Asigna el rol 'user' por defecto
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  initializeRecaptchaVerifier(containerId: string): void {
    if (!this.reCaptchaVerifier) {
      this.reCaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {'size': 'invisible'});
    }
  }

  loginWithPhoneNumber(phoneNumber: string): Promise<ConfirmationResult | void> {
    if (!this.reCaptchaVerifier) {
      console.error('Error: RecaptchaVerifier is not initialized');
      return Promise.reject('RecaptchaVerifier is not initialized');
    }

    return signInWithPhoneNumber(this.auth, phoneNumber, this.reCaptchaVerifier)
      .then(confirmationResult => {
        this.confirmationResult = confirmationResult;
        return confirmationResult;
      })
      .catch(error => {
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
      .catch(error => {
        console.error('Error confirming phone number', error);
        throw error;
      });
  }

  // Verificar si el usuario tiene el rol de admin
  async isAdmin(user: User): Promise<boolean> {
    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData?.['role'] === 'admin';
    }
    return false;
  }
  
  // Obtener el nombre del usuario desde Firestore
  async getUserName(user: User): Promise<string> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData?.['nombre'] || '';
      }
      return '';
    } catch (error) {
      console.error('Error getting user name', error);
      return '';
    }
  }

  // Obtener el correo del usuario desde Firestore
  async getUserEmail(user: User): Promise<string> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData?.['email'] || '';
      }
      return '';
    } catch (error) {
      console.error('Error getting user email', error);
      return '';
    }
  }
  
}
