import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { combineLatest, map } from 'rxjs';

import {
  ButtonComponent,
  EmptyComponent,
  InputDirective,
  LoadingComponent,
} from '../../components';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';

@Component({
  selector: 'bkr-check-out',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    InputDirective,
    LoadingComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent {
  readonly loading = toSignal(this.teamService.loading$, {
    initialValue: false,
  });
  readonly stationId = toSignal(this.authService.sub$, { initialValue: null });

  checkOutLoading = signal(false);
  form = new FormGroup({
    points: new FormControl<number>(0, {
      nonNullable: true,
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
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  handleCheckOut(teamId: string): void {
    const { points } = this.form.value;
    const stationId = this.stationId();

    if (!stationId || !points) {
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

          this.router.navigate(['/station']);
        },
        error: () => {
          this.checkOutLoading.set(false);
          this.notificationService.error(
            'Team konnte nicht ausgecheckt werden.'
          );
        },
      });
  }
}
