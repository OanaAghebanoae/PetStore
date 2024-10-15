import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyLetters]',
  standalone: true
})
export class OnlyLettersDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z]*$/);

  constructor(private ngControl: NgControl) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log("only letters directive - onKeyDown");
    const current: string = this.ngControl.control?.value || '';
    const next: string = current.concat(event.key);

    if (!this.regex.test(next)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    console.log("only letters directive - onInput");
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-Z]/g, '');
    if (sanitized !== input.value) {
      input.value = sanitized;
      this.ngControl.control?.setValue(sanitized);
    }
  }
}
