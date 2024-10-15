import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { Pet } from './models/pet.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom-validators';
import { PetService } from '../services/pet-service.service';
import { catchError, combineLatestWith, debounceTime, delay, finalize, of, startWith, switchMap, take, tap, zip } from 'rxjs';
import { OnlyLettersDirective } from '../../directives/only-letters.directive';
import { ShowIfAvailableDirective } from '../../directives/show-if-available.directive';
import { CapitalizeFirstDirective } from '../../directives/capitalize-first.directive';

@Component({
  selector: 'app-pet-store',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, OnlyLettersDirective, ShowIfAvailableDirective, CapitalizeFirstDirective],
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
    //const subscription = this.httpClient.get<Pet[]>('https://petstore.swagger.io/v2/pet/findByStatus?status=sold').subscribe({
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
    });

    const nameControl = this.newPetForm.get('name');
    const statusControl = this.newPetForm.get('status');

    if (nameControl && statusControl) {
      nameControl.valueChanges.pipe(
        startWith(nameControl.value),
        debounceTime(300),
        combineLatestWith(
          statusControl.valueChanges.pipe(
            startWith(statusControl.value)
          )
        )
      ).subscribe(([nameValue, statusValue]) => {
        console.log(`Name: ${nameValue}, Status: ${statusValue}`);
      });
    }

    // if (nameControl && statusControl) {
    //   zip(
    //     nameControl.valueChanges.pipe(startWith(nameControl.value)),
    //     statusControl.valueChanges.pipe(startWith(statusControl.value))
    //   ).subscribe(([nameValue, statusValue]) => {
    //     console.log(`Name: ${nameValue}, Status: ${statusValue}`);
    //   });
    // }
  }

  private initializeForm(): void {
    this.petsForm = this.fb.group({
      pets: this.fb.array([])
    })

    this.newPetForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.mustContainOnlyLetters]],
      status: ['', {
        validators: [Validators.required],
        asyncValidators: [CustomValidators.mustHaveOneOfValues(['available', 'pending', 'sold'])]
      }]
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

  // addPet() {
  //   if (this.newPetForm.valid) {
  //     const newPet = this.newPetForm.value as Pet;
  //     this.petService.addPet(newPet).pipe(
  //       catchError((error) => {
  //         console.error('Error adding pet:', error);
  //         return of(null);
  //       })
  //     ).subscribe({
  //       next: (res) => {
  //         if (res) {
  //           console.log('Pet added successfully:', res);
  //           this.pets.push(this.fb.group({
  //             id: [res.id],
  //             name: [res.name, [Validators.required, CustomValidators.mustContainOnlyLetters]],
  //             status: [res.status, {
  //               validators: [Validators.required],
  //               asyncValidators: [CustomValidators.mustHaveOneOfValues(['available', 'pending', 'sold'])]
  //             }]
  //           }));

  //           this.newPetForm.reset();
  //         }
  //       }
  //     });
  //   }
  // }

  addPet() {
    if (this.newPetForm.valid) {
      const newPet = this.newPetForm.value as Pet;
  
      this.petService.addPet(newPet).pipe(
        switchMap((res) => {
          console.log('Pet added successfully:', res);
  
          this.pets.push(this.fb.group({
            id: [res.id],
            name: [res.name, [Validators.required, CustomValidators.mustContainOnlyLetters]],
            status: [res.status, {
              validators: [Validators.required],
              asyncValidators: [CustomValidators.mustHaveOneOfValues(['available', 'pending', 'sold'])]
            }]
          }));
  
          return this.httpClient.get<Pet[]>('https://petstore.swagger.io/v2/pet/findByStatus?status=available').pipe(
            tap(() => console.log('Fetching updated pet list...')),
            delay(1000),
            take(1)
          );
        }),
        catchError((error) => {
          console.error('Error adding pet:', error);
          return of(null);
        }),
        finalize(() => {
          console.log('Pet adding process completed.');
        })
      ).subscribe({
        next: (updatedPets) => {
          if (updatedPets) {
            console.log('Updated list of pets:', updatedPets);
            this.setPets(updatedPets);
          }
          this.newPetForm.reset();
        }
      });
    }
  }

  editPet(index: number): void {
    const petFormGroup = this.pets.at(index) as FormGroup;

    this.petService.editPet(petFormGroup.value as Pet).subscribe({
      next: (res) => {
        console.log(`Editing pet at index ${index}`, petFormGroup.value);
      }
    });
  }
}

