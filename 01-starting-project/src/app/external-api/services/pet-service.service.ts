import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../pet-store/models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'https://petstore.swagger.io/v2/pet';

  constructor(private httpClient: HttpClient) { }

  addPet(pet: Pet): Observable<Pet> {
    return this.httpClient.post<Pet>(this.apiUrl, pet);
  }

  editPet(pet: Pet): Observable<Pet> {
    return this.httpClient.put<Pet>(this.apiUrl, pet);
  }
}
