import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirst]',
  standalone: true
})
export class CapitalizeFirstDirective implements OnChanges {
  @Input() appCapitalizeFirst: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appCapitalizeFirst']) {
      this.applyCapitalization();
    }
  }

  private applyCapitalization() {
    if (this.appCapitalizeFirst) {
      const formattedValue = this.appCapitalizeFirst.charAt(0).toUpperCase() + this.appCapitalizeFirst.slice(1).toLowerCase();
      this.el.nativeElement.value = formattedValue;
    }
  }
}
