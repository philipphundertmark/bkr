import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { EMPTY, combineLatest, map, switchMap } from 'rxjs';

import { Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { PauseIconComponent, PlayIconComponent } from '../../icons/mini';
import { AuthService, NotificationService, TeamService } from '../../services';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'bkr-team-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    PauseIconComponent,
    PlayIconComponent,
    RouterModule,
  ],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.teamService.loading$, { initialValue: false });
  deleteTeamLoading = signal(false);
  startTeamLoading = signal(false);
  stopTeamLoading = signal(false);

  team$ = combineLatest([this.route.paramMap, this.teamService.teams$]).pipe(
    map(([params, teams]) =>
      teams.find((team) => team.id === params.get('teamId'))
    )
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  formatTeamMembers(team: Team): string {
    if (!team.members.length) {
      return 'Keine Mitglieder';
    }

    return team.members.join(', ');
  }

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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
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
