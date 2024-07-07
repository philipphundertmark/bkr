import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';

import {
  ButtonComponent,
  EmptyComponent,
  InputDirective,
  MembersInputComponent,
} from '../../components';
import { AuthService, NotificationService, TeamService } from '../../services';
import { Store } from '../../services/store';
import { dateTimeValidator } from '../../validators';

@Component({
  selector: 'bkr-team-edit',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    InputDirective,
    MembersInputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamEditComponent {
  @HostBinding('class.page') page = true;

  paramMap = toSignal(this.route.paramMap, {
    initialValue: null,
  });

  teams = this.store.teams;

  teamId = computed(() => this.paramMap()?.get('teamId') ?? null);
  team = computed(() => {
    const teamId = this.teamId();

    if (!teamId) {
      return null;
    }

    return this.teams().find(({ id }) => id === teamId) ?? null;
  });

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    startedAt: new FormControl<string | null>(null, {
      validators: [dateTimeValidator()],
    }),
    finishedAt: new FormControl<string | null>(null, {
      validators: [dateTimeValidator()],
    }),
    help: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
    penalty: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    members: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });

  saveLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {
    effect(() => {
      const team = this.team();

      if (!team) {
        return;
      }

      this.form.patchValue({
        name: team.name,
        number: team.number,
        startedAt: team.startedAt?.format('DD.MM.YYYY HH:mm:ss') ?? null,
        finishedAt: team.finishedAt?.format('DD.MM.YYYY HH:mm:ss') ?? null,
        members: team.members ?? [],
        help: team.help,
        penalty: team.penalty,
      });
    });
  }

  handleSave(teamId: string): void {
    const { name, number, members, startedAt, finishedAt, help, penalty } =
      this.form.value;

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
      members
        ?.map((member) => member.trim())
        .filter((member) => member.length > 0) ?? [];

    this.saveLoading.set(true);

    this.teamService
      .updateTeam(teamId, {
        name,
        number,
        members: nonEmptyMembers,
        startedAt: startedAt
          ? dayjs(startedAt, 'DD.MM.YYYY HH:mm:ss').toISOString()
          : null,
        finishedAt: finishedAt
          ? dayjs(finishedAt, 'DD.MM.YYYY HH:mm:ss').toISOString()
          : null,
        help,
        penalty,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saveLoading.set(false);
          this.notificationService.success('Team wurde aktualisiert.');

          this.router.navigate(['/teams', teamId]);
        },
        error: (err: HttpErrorResponse) => {
          this.saveLoading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Team mit dieser Nummer.',
            );
          } else {
            this.notificationService.error(
              'Team konnte nicht aktualisiert werden.',
            );
          }
        },
      });
  }
}
