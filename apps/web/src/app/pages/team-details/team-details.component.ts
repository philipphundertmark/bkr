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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { EMPTY, switchMap } from 'rxjs';

import { Team, TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  DangerZoneComponent,
  EmptyComponent,
} from '../../components';
import {
  PauseIconComponent,
  PlayIconComponent,
  TrashIconComponent,
} from '../../icons/mini';
import { DatePipe } from '../../pipes';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'bkr-team-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    DangerZoneComponent,
    DatePipe,
    EmptyComponent,
    PauseIconComponent,
    PlayIconComponent,
    RouterModule,
    TrashIconComponent,
  ],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailsComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  paramMap = toSignal(this.route.paramMap, {
    initialValue: null,
  });

  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

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

  deleteTeamLoading = signal(false);
  deleteTeamResultsLoading = signal(false);
  startTeamLoading = signal(false);
  stopTeamLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService,
  ) {}

  handleDeleteTeam(teamId: string): void {
    this.confirmService
      .delete({
        title: 'Team löschen',
        message: 'Möchtest du das Team wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteTeamLoading.set(true);

          return this.teamService.deleteTeam(teamId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          window.plausible('Delete Team');

          this.deleteTeamLoading.set(false);
          this.notificationService.success('Team gelöscht.');

          this.router.navigate(['/teams']);
        },
        error: () => {
          this.deleteTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gelöscht werden.');
        },
      });
  }

  handleDeleteTeamResults(teamId: string): void {
    this.confirmService
      .delete({
        title: 'Ergebnisse löschen',
        message: 'Möchtest du die Ergebnisse des Teams wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteTeamResultsLoading.set(true);

          return this.resultService.deleteResultsByTeamId(teamId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          window.plausible('Delete Team Results');

          this.deleteTeamResultsLoading.set(false);
          this.notificationService.success('Ergebnisse gelöscht.');
        },
        error: () => {
          this.deleteTeamResultsLoading.set(false);
          this.notificationService.error(
            'Ergebnisse konnten nicht gelöscht werden.',
          );
        },
      });
  }

  handleStartTeam(teamId: string): void {
    this.confirmService
      .info({
        title: 'Team starten',
        message: 'Möchtest du das Team wirklich starten?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.startTeamLoading.set(true);

          return this.teamService.updateTeam(teamId, {
            startedAt: dayjs().toISOString(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          window.plausible('Start Team');

          this.startTeamLoading.set(false);
          this.notificationService.success('Team gestartet.');
        },
        error: () => {
          this.startTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gestartet werden.');
        },
      });
  }

  handleStopTeam(teamId: string): void {
    this.confirmService
      .info({
        title: 'Team stoppen',
        message: 'Möchtest du das Team wirklich stoppen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.stopTeamLoading.set(true);

          return this.teamService.updateTeam(teamId, {
            finishedAt: dayjs().toISOString(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          window.plausible('Stop Team');

          this.stopTeamLoading.set(false);
          this.notificationService.success('Team gestoppt.');
        },
        error: () => {
          this.stopTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gestoppt werden.');
        },
      });
  }
}
