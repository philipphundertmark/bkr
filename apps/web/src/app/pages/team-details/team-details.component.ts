import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { AuthService, TeamService } from '../../services';

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

  team$ = combineLatest([this.route.paramMap, this.teamService.teams$]).pipe(
    map(([params, teams]) =>
      teams.find((team) => team.id === params.get('teamId'))
    )
  );

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService
  ) {}

  formatTeamMembers(team: Team): string {
    if (!team.members.length) {
      return 'Keine Mitglieder';
    }

    return team.members.join(', ');
  }
}
