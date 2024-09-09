import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { Pet } from './models/pet.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom-validators';
import { PetService } from '../services/pet-service.service';

@Component({
  selector: 'app-pet-store',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pet-store.component.html',
  styleUrl: './pet-store.component.css'
})
export class PetStoreComponent implements OnInit {
  petsForm!: FormGroup;
  newPetForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    public petService: PetService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    const subscription = this.httpClient.get<Pet[]>('https://petstore.swagger.io/v2/pet/findByStatus?status=available').subscribe({
      next: (resData) => {
        console.log("available pets: ", resData);
        this.setPets(resData);
      },
      error: (err) => {
        console.error('Error fetching pets:', err);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  private initializeForm(): void {
    this.petsForm = this.fb.group({
      pets: this.fb.array([])
    })
    
    this.newPetForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.mustContainOnlyLetters]],
      status: ['', [Validators.required, CustomValidators.mustHaveOneOfValues(['available', 'pending', 'sold'])]]
    });
  }

  get pets() {
    return this.petsForm.get('pets') as FormArray;
  }

  setPets(pets: Pet[]): void {
    const petFormGroups = pets.map(pet => this.fb.group({
      id: [pet.id],
      name: [pet.name, Validators.required],
      status: [pet.status, Validators.required]
    }));
    const petFormArray = this.fb.array(petFormGroups);
    this.petsForm.setControl('pets', petFormArray);
  }

  addPet() {
    if (this.newPetForm.valid) {
      const newPet = this.newPetForm.value as Pet;
      this.petService.addPet(newPet).subscribe({
        next: (res) => {
          console.log('Pet added successfully:', res);

          this.pets.push(this.fb.group({
            id: [res.id],
            name: [res.name, [Validators.required, CustomValidators.mustContainOnlyLetters]],
            status: [res.status, {validators: [Validators.required],
              asyncValidators: [ CustomValidators.mustHaveOneOfValues(['available', 'pending', 'sold'])]
            }]
          }));

          this.newPetForm.reset();
        },
        error: (err) => {
          console.error('Error adding pet:', err);
        }
      });
    }
  }
}

