import { CommonModule } from '@angular/common';
import { Component, HostBinding, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import {
  ResultWithRank,
  Station,
  StationUtils,
  Team,
  TeamUtils,
} from '@bkr/api-interface';

import {
  AlertComponent,
  ButtonComponent,
  EmptyComponent,
  TabComponent,
  TabsComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, StationService, TeamService } from '../../services';

type ResultWithRankAndTeam = ResultWithRank & { team: Team };

@Component({
  selector: 'bkr-my-station',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    RouterModule,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './my-station.component.html',
  styleUrls: ['./my-station.component.scss'],
})
export class MyStationComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  ranking = signal('standard');

  stationId = toSignal(this.authService.sub$, { initialValue: null });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  checkedInTeams = computed(() => {
    return this.teams().filter((team) =>
      team.results.some(
        (result) => result.stationId === this.stationId() && !result.checkOut
      )
    );
  });

  station = computed(() => {
    return this.stations().find((station) => station.id === this.stationId());
  });

  teamsForRanking = computed(() =>
    this.teams().filter((team) =>
      this.ranking() === 'standard' ? !team.help : team.help
    )
  );

  results = computed(() => {
    const station = this.station();
    const teams = this.teamsForRanking();

    if (!station) {
      return [];
    }

    return (
      StationUtils.getResultsForTeamsWithRank(station, teams)
        // Find the team for each result
        .map((result) => ({
          ...result,
          team: this.teams().find((team) => team.id === result.teamId),
        }))
        // Filter out results that don't have a team
        .filter(
          (result): result is ResultWithRankAndTeam =>
            typeof result.team !== 'undefined'
        )
    );
  });

  constructor(
    private readonly authService: AuthService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  handleChangeRanking(ranking: string): void {
    this.ranking.set(ranking);
  }
}
