import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { EMPTY, combineLatest, map, switchMap } from 'rxjs';

import {
  ButtonComponent,
  DangerZoneComponent,
  EmptyComponent,
  InputDirective,
} from '../../components';
import { TrashIconComponent } from '../../icons/mini';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';
import { Store } from '../../services/store';
import { dateTimeValidator } from '../../validators';

@Component({
  selector: 'bkr-result',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    DangerZoneComponent,
    EmptyComponent,
    InputDirective,
    ReactiveFormsModule,
    RouterModule,
    TrashIconComponent,
  ],
  host: { class: 'page' },
  styleUrl: './result.component.scss',
  templateUrl: './result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent implements OnInit {
  deleteResultLoading = signal(false);
  updateResultLoading = signal(false);

  form = new FormGroup({
    checkIn: new FormControl<string | null>(null, {
      validators: [Validators.required, dateTimeValidator()],
    }),
    checkOut: new FormControl<string | null>(null, {
      validators: [dateTimeValidator()],
    }),
    points: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  teamId$ = this.route.queryParamMap.pipe(
    map((params) => params.get('teamId')),
  );
  teamId = toSignal(this.teamId$, { initialValue: null });

  team = computed(
    () => this.store.teams().find((team) => team.id === this.teamId()) ?? null,
    {
      equal: (a, b) => a?.id === b?.id,
    },
  );
  team$ = toObservable(this.team);

  result$ = combineLatest([this.team$, this.authService.sub$]).pipe(
    map(
      ([team, stationId]) =>
        team?.results.find((result) => result.stationId === stationId) ?? null,
    ),
  );
  result = toSignal(this.result$, { initialValue: null });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.result$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.form.patchValue({
          checkIn: result?.checkIn.format('DD.MM.YYYY HH:mm:ss') ?? null,
          checkOut: result?.checkOut?.format('DD.MM.YYYY HH:mm:ss') ?? null,
          points: result?.points,
        });
      });
  }

  handleUpdateResult(stationId: string, teamId: string): void {
    const { checkIn, checkOut, points } = this.form.value;

    if (typeof checkIn !== 'string' || typeof points !== 'number') {
      return;
    }

    this.updateResultLoading.set(true);

    this.resultService
      .updateResult(stationId, teamId, {
        checkIn: dayjs(checkIn, 'DD.MM.YYYY HH:mm:ss').toISOString(),
        checkOut: checkOut
          ? dayjs(checkOut, 'DD.MM.YYYY HH:mm:ss').toISOString()
          : null,
        points,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.updateResultLoading.set(false);
          this.notificationService.success('Ergebnis wurde aktualisiert.');

          this.router.navigate(['/my-station']);
        },
        error: () => {
          this.updateResultLoading.set(false);
          this.notificationService.error(
            'Ergebnis konnte nicht aktualisiert werden.',
          );
        },
      });
  }

  handleDeleteResult(stationId: string, teamId: string): void {
    this.confirmService
      .delete({
        title: 'Ergebnis löschen',
        message: 'Möchtest du das Ergebnis wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteResultLoading.set(true);

          return this.resultService.deleteResult(stationId, teamId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.deleteResultLoading.set(false);
          this.notificationService.success('Ergebnis gelöscht.');

          this.router.navigate(['/my-station']);
        },
        error: () => {
          this.deleteResultLoading.set(false);
          this.notificationService.error(
            'Ergebnis konnte nicht gelöscht werden.',
          );
        },
      });
  }
}
