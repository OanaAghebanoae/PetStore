import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PetService } from './app/external-api/services/pet-service.service';


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), ReactiveFormsModule, PetService]
}).catch((err) => console.error(err));
