import { Directive, HostBinding, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[bkrInput]',
  standalone: true,
})
export class InputDirective {
  @HostBinding('class.input') input = true;

  @HostBinding('class.invalid') get invalid(): boolean {
    return this.ngControl?.invalid ?? false
  }

  constructor(@Optional() private readonly ngControl: NgControl) {}
}
