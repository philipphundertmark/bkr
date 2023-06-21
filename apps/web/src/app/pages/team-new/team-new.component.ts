import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonComponent, InputDirective } from '../../components';
import { XMarkIconComponent } from '../../icons/mini';
import { NotificationService, TeamService } from '../../services';

@Component({
  selector: 'bkr-team-new',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputDirective,
    ReactiveFormsModule,
    RouterModule,
    XMarkIconComponent,
  ],
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss'],
})
export class TeamNewComponent {
  @ViewChildren('memberInput') memberInputs?: QueryList<ElementRef>;

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    members: new FormArray([this.buildMemberControl()]),
  });
  loading = false;

  private readonly destroyRef = inject(DestroyRef);

  get members(): FormArray<FormControl<string>> {
    return this.form.controls['members'];
  }

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

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

  handleSave(): void {
    const { name, number, members } = this.form.value;

    if (
      this.form.invalid ||
      typeof name === 'undefined' ||
      typeof number === 'undefined' ||
      number === null
    ) {
      return;
    }

    const nonEmptyMembers =
      members?.filter((member) => member.length > 0) ?? [];

    this.loading = true;

    this.teamService
      .createTeam({
        name,
        number,
        members: nonEmptyMembers,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.notificationService.success('Team wurde erstellt.');

          this.router.navigate(['/teams']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Team mit dieser Nummer.'
            );
          } else {
            this.notificationService.error(
              'Team konnte nicht erstellt werden.'
            );
          }
        },
      });
  }

  private buildMemberControl(): FormControl<string> {
    return new FormControl<string>('', {
      nonNullable: true,
    });
  }

  private focusMemberInputAt(index: number): void {
    this.memberInputs?.get(index)?.nativeElement.focus();
  }
}
