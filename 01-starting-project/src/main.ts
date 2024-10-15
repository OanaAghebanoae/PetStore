import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PetService } from './app/external-api/services/pet-service.service';
import { OnlyLettersDirective } from './app/directives/only-letters.directive';


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), ReactiveFormsModule, PetService, OnlyLettersDirective]
}).catch((err) => console.error(err));
