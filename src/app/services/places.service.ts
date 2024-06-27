import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import Place from '../interfaces/place.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private firestore: Firestore) { }

  //Esta función se encarga de agregar un nuevo lugar (place) a una colección en Firestore (base de datos en la nube de Firebase). 
  //Primero crea una referencia a la colección 'places', y luego utiliza addDoc() para insertar el lugar en esa colección.
  addPlace(place: Place) {
    //Creamos una referencia contra la base de datos
    //A tavés de collection podremos acceder a las diferentes colecciones almacenadas
    const placesRef = collection(this.firestore, 'places'); //Como segundo parámetro le pasamos el nombre de la colección (No hace falta que este previamente generada)
    return addDoc(placesRef, place); //Le retornamos la llamada a addDoc pasandole la colección donde vamos a hacer la inserción y lo que vamos a intertar
  }

  //Esta función devuelve un Observable que contiene un array de objetos Place. Consulta la colección 'places' en Firestore 
  //y devuelve todos los documentos de esa colección como un array de objetos Place.
  getPlaces() : Observable<Place[]> { //Estamos al pendiente con el Observable y nos devuelve un array con los diferentes Places
    const placesRef = collection(this.firestore, 'places'); //Como segundo parámetro le pasamos el nombre de la colección (No hace falta que este previamente generada)
    return collectionData(placesRef, {idField: 'id'}) as Observable<Place[]>; //Le pasamos la referencia y le indicamos el indice
  }

  //Esta función elimina un lugar específico de la colección en Firestore. 
  //Utiliza la referencia al documento del lugar que se desea eliminar y luego llama a deleteDoc() para borrar dicho documento de la base de datos.
  deletePlace(place: Place) {
    const placeDocRef = doc(this.firestore, `places/${place.id}`) //Le señalamos de donde lo sacamos(firestore) y la referencia
    return deleteDoc(placeDocRef); //Retornamos la llamada y le colocamos el documento que queremos borrar
  }
}
