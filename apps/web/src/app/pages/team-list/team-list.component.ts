import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Team } from '@bkr/api-interface';

import { ButtonComponent } from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, TeamService } from '../../services';

@Component({
  selector: 'bkr-team-list',
  standalone: true,
  imports: [
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  teams = toSignal(this.teamService.teams$, { initialValue: [] as Team[] });

  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService
  ) {}

  formatTeamMembers(team: Team): string {
    if (!team.members.length) {
      return 'Keine Mitglieder';
    }

    return team.members.join(', ');
  }
}
