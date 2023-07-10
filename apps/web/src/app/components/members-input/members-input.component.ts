import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  Optional,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
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
  templateUrl: './members-input.component.html',
  styleUrls: ['./members-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersInputComponent implements ControlValueAccessor, OnInit {
  @ViewChildren('memberInput') memberInputs?: QueryList<ElementRef>;

  onChange?: (value: string[]) => void;
  onTouched?: () => void;

  form = new FormGroup({
    members: new FormArray<FormControl<string>>([]),
  });

  private readonly destroyRef = inject(DestroyRef);

  get members(): FormArray<FormControl<string>> {
    return this.form.controls['members'];
  }

  constructor(@Optional() public ngControl?: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.onChange) {
          this.onChange(value.members ?? []);
        }
      });
  }

  /**
   * @implements {ControlValueAccessor}
   */
  writeValue(value: string[]): void {
    this.members.clear();

    for (let i = 0; i < (value.length || 1); i++) {
      this.members.push(this.buildMemberControl(value[i]));
    }
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
    this.members.push(this.buildMemberControl());

    setTimeout(() => this.focusMemberInputAt(this.members.length - 1), 0);
  }

  handleEnterAt(event: Event, index: number): void {
    event.preventDefault();

    if (index >= this.members.length) {
      // Invalid index
      return;
    }

    if (index === this.members.length - 1) {
      this.handleAddMember();
    }

    this.focusMemberInputAt(index + 1);
  }

  handleRemoveMemberAt(index: number): void {
    this.members.removeAt(index);

    setTimeout(() => {
      if (index >= this.members.length) {
        index = this.members.length - 1;
      }

      this.focusMemberInputAt(index);
    }, 0);
  }

  private buildMemberControl(value?: string): FormControl<string> {
    return new FormControl<string>(value ?? '', {
      nonNullable: true,
    });
  }

  private focusMemberInputAt(index: number): void {
    this.memberInputs?.get(index)?.nativeElement.focus();
  }
}
