import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostBinding,
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
import { EMPTY, combineLatest, map, switchMap } from 'rxjs';

import {
  ButtonComponent,
  DangerZoneComponent,
  EmptyComponent,
  InputDirective,
  LoadingComponent,
} from '../../components';
import { TrashIconComponent } from '../../icons/mini';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'bkr-check-out',
  standalone: true,
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  imports: [
    ButtonComponent,
    CommonModule,
    DangerZoneComponent,
    EmptyComponent,
    InputDirective,
    LoadingComponent,
    ReactiveFormsModule,
    RouterModule,
    TrashIconComponent,
  ],
})
export class CheckOutComponent {
  @HostBinding('class.page') page = true;

  readonly loading = toSignal(this.teamService.loading$, {
    initialValue: false,
  });
  readonly stationId = toSignal(this.authService.sub$, { initialValue: null });

  checkOutLoading = signal(false);
  deleteResultLoading = signal(false);

  form = new FormGroup({
    points: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  team$ = combineLatest([
    this.route.queryParamMap,
    this.teamService.teams$,
  ]).pipe(
    map(([params, teams]) =>
      teams.find((team) => team.id === params.get('teamId'))
    )
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  handleCheckOut(teamId: string): void {
    const { points } = this.form.value;
    const stationId = this.stationId();

    if (!stationId || typeof points !== 'number') {
      return;
    }

    this.checkOutLoading.set(true);

    this.resultService
      .updateResult(stationId, teamId, {
        checkOut: dayjs().toISOString(),
        points,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.checkOutLoading.set(false);
          this.notificationService.success('Team wurde ausgecheckt.');

          this.router.navigate(['/my-station']);
        },
        error: () => {
          this.checkOutLoading.set(false);
          this.notificationService.error(
            'Team konnte nicht ausgecheckt werden.'
          );
        },
      });
  }

  handleDeleteResult(teamId: string): void {
    const stationId = this.stationId();

    if (!stationId) {
      return;
    }

    this.confirmService
      .delete({
        title: 'Check-in löschen',
        message: 'Möchtest du den Check-in wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteResultLoading.set(true);

          return this.resultService.deleteResult(stationId, teamId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.deleteResultLoading.set(false);
          this.notificationService.success('Check-in gelöscht.');

          this.router.navigate(['/my-station']);
        },
        error: () => {
          this.deleteResultLoading.set(false);
          this.notificationService.error(
            'Check-in konnte nicht gelöscht werden.'
          );
        },
      });
  }
}
