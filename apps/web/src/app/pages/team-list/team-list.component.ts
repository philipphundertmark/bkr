import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Team, TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, TeamService } from '../../services';

@Component({
  selector: 'bkr-team-list',
  standalone: true,
  imports: [
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.teamService.loading$, { initialValue: false });
  teams = toSignal(this.teamService.teams$, { initialValue: [] as Team[] });

  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService
  ) {}
}
