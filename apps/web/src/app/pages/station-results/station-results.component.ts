import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import dayjs from 'dayjs';

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
import {
  AuthService,
  SettingsService,
  StationService,
  TeamService,
} from '../../services';

type ResultWithRankAndTeam = ResultWithRank & { team: Team };

@Component({
  selector: 'bkr-station-results',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    RouterModule,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './station-results.component.html',
  styleUrls: ['./station-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationResultsComponent {
  @HostBinding('class.page') page = true;

  readonly StationUtils = StationUtils;
  readonly TeamUtils = TeamUtils;

  ranking = signal('standard');

  paramMap = toSignal(this.route.paramMap, {
    initialValue: null,
  });

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });
  isRaceOver = toSignal(this.teamService.isRaceOver$, {
    initialValue: false,
  });
  publishResults = toSignal(this.settingsService.publishResults$, {
    initialValue: false,
  });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  teamsForRanking = computed(() =>
    this.teams().filter((team) =>
      this.ranking() === 'standard' ? !team.help : team.help
    )
  );

  stationId = computed(() => this.paramMap()?.get('stationId') ?? null);
  station = computed(() => {
    const stationId = this.stationId();

    if (!stationId) {
      return null;
    }

    return this.stations().find((station) => station.id === stationId) ?? null;
  });

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
    private readonly route: ActivatedRoute,
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }

  handleChangeRanking(ranking: string): void {
    this.ranking.set(ranking);
  }
}
