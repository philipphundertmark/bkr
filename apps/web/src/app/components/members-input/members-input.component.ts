import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Optional,
  signal,
  viewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { XMarkIconComponent } from '../../icons/mini';
import { ButtonComponent } from '../button/button.component';
import { InputDirective } from '../input.directive';

@Component({
  selector: 'bkr-members-input',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputDirective,
    ReactiveFormsModule,
    XMarkIconComponent,
  ],
  styleUrl: './members-input.component.scss',
  templateUrl: './members-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersInputComponent implements ControlValueAccessor {
  memberInputs = viewChildren<ElementRef<HTMLInputElement>>('memberInput');

  members = signal<string[]>([]);

  onChange?: (value: string[]) => void;
  onTouched?: () => void;

  constructor(@Optional() public ngControl?: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @implements {ControlValueAccessor}
   */
  writeValue(value: string[]): void {
    this.members.set(value);
  }

  /**
   * @implements {ControlValueAccessor}
   */
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  /**
   * @implements {ControlValueAccessor}
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleAddMember(): void {
    this.members.update((value) => [...value, '']);

    this.onChange?.(this.members());

    setTimeout(() => this.focusMemberInputAt(this.members().length - 1), 0);
  }

  handleEnterAt(event: Event, index: number): void {
    event.preventDefault();

    if (index >= this.members().length) {
      // Invalid index
      return;
    }

    if (index === this.members().length - 1) {
      this.handleAddMember();
    }

    this.focusMemberInputAt(index + 1);
  }

  handleMemberChangeAt(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.members.update((members) =>
      members.map((member, i) => (i === index ? value : member)),
    );

    this.onChange?.(this.members());
  }

  handleRemoveMemberAt(index: number): void {
    this.members.update((members) =>
      members.slice(0, index).concat(members.slice(index + 1)),
    );

    this.onChange?.(this.members());

    setTimeout(() => {
      if (index >= this.members().length) {
        index = this.members().length - 1;
      }

      this.focusMemberInputAt(index);
    }, 0);
  }

  private focusMemberInputAt(index: number): void {
    this.memberInputs().at(index)?.nativeElement.focus();
  }
}
