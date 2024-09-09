import { Component } from '@angular/core';

import { PetStoreComponent } from './external-api/pet-store/pet-store.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [PetStoreComponent, ReactiveFormsModule],
})
export class AppComponent {}
