import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EMPTY, combineLatest, map, switchMap } from 'rxjs';

import { Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
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
    RouterModule,
  ],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.teamService.loading$, { initialValue: false });
  deleteTeamLoading = signal(false);

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
        },
        error: () => {
          this.deleteTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gelöscht werden.');
        },
      });
  }
}
