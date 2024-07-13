import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  ButtonComponent,
  InputDirective,
  MembersInputComponent,
} from '../../components';
import { NotificationService, TeamService } from '../../services';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-team-new',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputDirective,
    MembersInputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  host: { class: 'page' },
  styleUrl: './team-new.component.scss',
  templateUrl: './team-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamNewComponent {
  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    members: new FormControl<string[]>([''], {
      nonNullable: true,
    }),
    help: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
  });

  loading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  handleSave(): void {
    const { name, number, members, help } = this.form.value;

    if (
      this.form.invalid ||
      typeof name === 'undefined' ||
      typeof number === 'undefined' ||
      number === null ||
      typeof help === 'undefined'
    ) {
      return;
    }

    const nonEmptyMembers =
      members?.filter((member) => member.length > 0) ?? [];

    this.loading.set(true);

    this.teamService
      .createTeam({
        name,
        number,
        members: nonEmptyMembers,
        help,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (team) => {
          this.loading.set(false);
          this.store.setTeam(team);
          this.notificationService.success('Team wurde erstellt.');

          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Team mit dieser Nummer.',
            );
          } else {
            this.notificationService.error(
              'Team konnte nicht erstellt werden.',
            );
          }
        },
      });
  }
}
