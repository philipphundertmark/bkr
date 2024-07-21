import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';

import { Ranking } from '@bkr/api-interface';

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
  host: { class: 'page' },
  styleUrl: './team-edit.component.scss',
  templateUrl: './team-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamEditComponent implements OnInit {
  readonly Ranking = Ranking;

  @HostBinding('class.page') page = true;

  /** Route parameter */
  teamId = input.required<string>();

  teams = this.store.teams;

  team = computed(
    () => this.teams().find(({ id }) => id === this.teamId()) ?? null,
  );
  team$ = toObservable(this.team);

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });

  saveLoading = signal(false);

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
    ranking: new FormControl<Ranking>(Ranking.A, {
      nonNullable: true,
    }),
    penalty: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    members: new FormControl<string[]>([''], {
      nonNullable: true,
    }),
  });

  formStatus = toSignal(this.form.statusChanges, { initialValue: 'INVALID' });
  formInvalid = computed(() => this.formStatus() === 'INVALID');

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.team$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((team) => {
      if (!team) {
        this.router.navigate(['/']);
        return;
      }

      this.form.patchValue({
        name: team.name,
        number: team.number,
        startedAt: team.startedAt?.format('DD.MM.YYYY HH:mm:ss') ?? null,
        finishedAt: team.finishedAt?.format('DD.MM.YYYY HH:mm:ss') ?? null,
        members: team.members.length ? team.members : [''],
        ranking: team.ranking,
        penalty: team.penalty,
      });
    });
  }

  handleSave(teamId: string): void {
    const { name, number, members, startedAt, finishedAt, ranking, penalty } =
      this.form.value;

    if (
      this.form.invalid ||
      typeof name === 'undefined' ||
      typeof number === 'undefined' ||
      number === null ||
      typeof ranking === 'undefined'
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
        ranking,
        penalty,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (team) => {
          this.saveLoading.set(false);
          this.store.setTeam(team);
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
