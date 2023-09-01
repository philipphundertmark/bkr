import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  computed,
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
import { Router, RouterModule } from '@angular/router';

import { TeamUtils } from '@bkr/api-interface';

import {
  AlertComponent,
  ButtonComponent,
  EmptyComponent,
} from '../../components';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';

@Component({
  selector: 'bkr-check-in',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  stationId = toSignal(this.authService.sub$, {
    initialValue: null,
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [],
  });

  checkInLoading = signal(false);
  teamsToCheckIn = computed(() => {
    return this.teams()
      .filter(TeamUtils.isRunning)
      .filter(
        (team) =>
          !team.results.some((result) => result.stationId === this.stationId())
      );
  });

  form = new FormGroup({
    selectedTeamId: new FormControl<string>('', Validators.required),
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  handleCheckIn(): void {
    const { selectedTeamId } = this.form.value;
    const stationId = this.stationId();

    if (!stationId || !selectedTeamId) {
      return;
    }

    this.checkInLoading.set(true);

    this.resultService
      .createResult(stationId, selectedTeamId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          window.plausible('Check-In');

          this.checkInLoading.set(false);
          this.notificationService.success('Team wurde eingecheckt.');

          this.router.navigate(['/my-station']);
        },
        error: () => {
          this.checkInLoading.set(false);
          this.notificationService.error(
            'Team konnte nicht eingecheckt werden.'
          );
        },
      });
  }

  handleSelectTeam(teamId: string): void {
    this.form.patchValue({ selectedTeamId: teamId });
  }
}
