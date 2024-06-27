import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  //Datos de la API de Firebase para extraer los datos
  projectId: "registro-estancias",
  appId: "1:741516151149:web:15f2901a79e946cbbdf264",
  storageBucket: "registro-estancias.appspot.com",
  apiKey: "AIzaSyCBy-KVsXrQZ-mU4Wu53MrzIc1dmsBTULg",
  authDomain: "registro-estancias.firebaseapp.com",
  messagingSenderId: "741516151149",
  measurementId: "G-EFR0LDDJ3M"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
};
