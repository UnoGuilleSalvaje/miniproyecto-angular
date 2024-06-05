import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import Place from '../interfaces/place.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private firestore: Firestore) { }

  addPlace(place: Place) {
    //Creamos una referencia contra la base de datos
    //A tavés de collection podremos acceder a las diferentes colecciones almacenadas
    const placesRef = collection(this.firestore, 'places'); //Como segundo parámetro le pasamos el nombre de la colección (No hace falta que este previamente generada)
    return addDoc(placesRef, place); //Le retornamos la llamada a addDoc pasandole la colección donde vamos a hacer la inserción y lo que vamos a intertar
  }

  getPlaces() : Observable<Place[]> { //Estamos al pendiente con el Observable y nos devuelve un array con los diferentes Places
    const placesRef = collection(this.firestore, 'places'); //Como segundo parámetro le pasamos el nombre de la colección (No hace falta que este previamente generada)
    return collectionData(placesRef, {idField: 'id'}) as Observable<Place[]>; //Le pasamos la referencia y le indicamos el indice
  }

  deletePlace(place: Place) {
    const placeDocRef = doc(this.firestore, `places/${place.id}`) //Le señalamos de donde lo sacamos(firestore) y la referencia
    return deleteDoc(placeDocRef); //Retornamos la llamada y le colocamos el documento que queremos borrar
  }
}
