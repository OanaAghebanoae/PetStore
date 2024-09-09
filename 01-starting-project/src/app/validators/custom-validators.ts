import { AbstractControl, ValidationErrors } from "@angular/forms";
import { delay, map, Observable, of } from "rxjs";

export class CustomValidators {
    static mustContainOnlyLetters(control: AbstractControl): ValidationErrors | null {
        const regex = /^[a-zA-Z]+$/;
        const valid = regex.test(control.value);
    
        return valid ? null : { mustContainOnlyLetters: { value: control.value } };
      }

      static mustHaveOneOfValues(validValues: any[]): (control: AbstractControl) => Observable<ValidationErrors | null> {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          console.log('validator is executed');
          return of(validValues).pipe(
            delay(1000),
            map((values) => {
              //console.log(isValid);
              const isValid = values.includes(control.value)
              return isValid ? null : { invalidValue: { value: control.value } };
            })
          );
        };
      }
    }