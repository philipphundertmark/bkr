import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { map } from 'rxjs';

import {
  ResultWithRank,
  Station,
  StationUtils,
  Team,
  TeamUtils,
} from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { SettingsService, StationService, TeamService } from '../../services';

type ResultWithRankAndTeam = ResultWithRank & { team: Team };

@Component({
  selector: 'bkr-station-results',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './station-results.component.html',
  styleUrls: ['./station-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationResultsComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  readonly timeBonus = this.stationService.TIME_BONUS;

  isRaceOver = toSignal(this.teamService.isRaceOver$, { initialValue: false });
  publishResults = toSignal(this.settingsService.publishResults$, {
    initialValue: false,
  });

  loading = computed(() => this.stationsLoading() || this.teamsLoading());
  stationsLoading = toSignal(this.stationService.loading$, {
    initialValue: false,
  });
  teamsLoading = toSignal(this.teamService.loading$, { initialValue: false });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  stationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('stationId'))),
    {
      initialValue: null,
    }
  );
  station = computed(
    () =>
      this.stations().find((station) => station.id === this.stationId()) ?? null
  );

  results = computed(() => {
    const station = this.station();

    if (!station) {
      return [];
    }

    return (
      StationUtils.getResultsWithRank(station)
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
    private readonly route: ActivatedRoute,
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }
}
