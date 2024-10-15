import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appShowIfAvailable]',
    standalone: true
})
export class ShowIfAvailableDirective {
    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set appShowIfAvailable(status: string) {
        if (status === 'available' && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }
        else {
            if (status !== 'available' && this.hasView) {
                this.viewContainer.clear();
                this.hasView = false;
            }
        }
    }
}
