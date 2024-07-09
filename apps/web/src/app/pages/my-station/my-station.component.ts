import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import {
  Order,
  ResultWithRank,
  StationUtils,
  TeamUtils,
  TeamWithResults,
} from '@bkr/api-interface';

import {
  AlertComponent,
  ButtonComponent,
  EmptyComponent,
  TabComponent,
  TabsComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService } from '../../services';
import { Store } from '../../services/store';

type ResultWithRankAndTeam = ResultWithRank & { team: TeamWithResults };

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
  host: { class: 'page' },
  styleUrl: './my-station.component.scss',
  templateUrl: './my-station.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyStationComponent {
  readonly Order = Order;
  readonly TeamUtils = TeamUtils;

  ranking = signal('standard');

  stationId = toSignal(this.authService.sub$, { initialValue: null });

  stations = this.store.stations;
  teams = this.store.teams;

  checkedInTeams = computed(() =>
    this.teams().filter((team) =>
      team.results.some(
        (result) => result.stationId === this.stationId() && !result.checkOut,
      ),
    ),
  );

  station = computed(() =>
    this.stations().find((station) => station.id === this.stationId()),
  );

  teamsForRanking = computed(() =>
    this.teams().filter((team) =>
      this.ranking() === 'standard' ? !team.help : team.help,
    ),
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
            typeof result.team !== 'undefined',
        )
    );
  });

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {}
}
