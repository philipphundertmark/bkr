import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, TeamService } from '../../services';

@Component({
  selector: 'bkr-my-station',
  standalone: true,
  imports: [
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './my-station.component.html',
  styleUrls: ['./my-station.component.scss'],
})
export class MyStationComponent {
  readonly TeamUtils = TeamUtils;

  readonly loading = toSignal(this.teamService.loading$, {
    initialValue: false,
  });
  readonly stationId = toSignal(this.authService.sub$, { initialValue: null });
  readonly teams = toSignal(this.teamService.teams$, { initialValue: [] });

  readonly checkedInTeams = computed(() => {
    return this.teams().filter((team) =>
      team.results.some(
        (result) => result.stationId === this.stationId() && !result.checkOut
      )
    );
  });
  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService
  ) {}
}
