import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import {
  Order,
  Ranking,
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
import { DurationPipe } from '../../pipes';
import { AuthService, PreferencesService } from '../../services';
import { Store } from '../../services/store';

type ResultWithRankAndTeam = ResultWithRank & { team: TeamWithResults };

@Component({
  selector: 'bkr-station-results',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CommonModule,
    DurationPipe,
    EmptyComponent,
    RouterModule,
    TabComponent,
    TabsComponent,
  ],
  host: { class: 'page' },
  styleUrl: './station-results.component.scss',
  templateUrl: './station-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationResultsComponent {
  readonly Order = Order;
  readonly Ranking = Ranking;
  readonly StationUtils = StationUtils;
  readonly TeamUtils = TeamUtils;

  /**
   * Route parameter
   */
  stationId = input.required<string>();

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  ranking = this.preferencesService.stationResultsSelectedRanking;

  stations = this.store.stations;
  teams = this.store.teams;

  isRaceOver = this.store.raceIsOver;
  publishResults = this.store.publishResults;

  teamsForRanking = computed(() =>
    this.teams().filter((team) => team.ranking === this.ranking()),
  );

  station = computed(
    () =>
      this.stations().find((station) => station.id === this.stationId()) ??
      null,
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
    private readonly preferencesService: PreferencesService,
    private readonly store: Store,
  ) {}
}
