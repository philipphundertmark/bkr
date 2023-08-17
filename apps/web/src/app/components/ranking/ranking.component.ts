import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { BehaviorSubject } from 'rxjs';

import { Station, StationUtils, Team, TeamUtils } from '@bkr/api-interface';

import { RankingItemComponent } from './ranking-item/ranking-item.component';

interface RankByTeam {
  [teamId: string]: number;
}

interface RankByTeamByStation {
  [stationId: string]: RankByTeam;
}

interface StationResult {
  bonus: number;
  stationId: string;
  time: number;
}

export interface RankingItem {
  // Name of the team
  name: string;
  // Number of the team
  number: number;
  // Penalty time in seconds
  penalty: number;
  results: StationResult[];
  // Time in seconds
  time: number;
  // Total time in seconds
  totalTime: number;
}

@Component({
  selector: 'bkr-ranking',
  standalone: true,
  imports: [CommonModule, RankingItemComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'ranking', required: true })
  set _ranking(value: string) {
    this.ranking$.next(value);
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'stations', required: true })
  set _stations(value: Station[]) {
    this.stations$.next(value);
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'teams', required: true })
  set _teams(value: Team[]) {
    this.teams$.next(value);
  }

  @HostBinding('class.list') list = true;

  ranking$ = new BehaviorSubject<string>('standard');
  stations$ = new BehaviorSubject<Station[]>([]);
  teams$ = new BehaviorSubject<Team[]>([]);

  ranking = toSignal(this.ranking$, { initialValue: 'standard' });
  stations = toSignal(this.stations$, { initialValue: [] as Station[] });
  teams = toSignal(this.teams$, { initialValue: [] as Team[] });

  teamsForRanking = computed(() =>
    this.teams().filter((team) =>
      this.ranking() === 'standard' ? !team.help : team.help
    )
  );

  rankingItems = computed(() => {
    const stations = this.stations();
    const teams = this.teamsForRanking();

    const rankByTeamByStation = this.getRankByTeamByStation(stations, teams);

    return teams
      .map((team): Omit<RankingItem, 'time'> => {
        return {
          name: TeamUtils.getTeamName(team),
          number: team.number,
          penalty: team.penalty * 60,
          results: this.getStationResultsOfTeam(
            team,
            stations,
            rankByTeamByStation
          ),
          totalTime: team.finishedAt?.diff(team.startedAt, 'seconds') ?? 0,
        };
      })
      .map((rankingItem): RankingItem => {
        const totalTime = dayjs.duration(rankingItem.totalTime, 'seconds');
        const penalty = dayjs.duration(rankingItem.penalty, 'seconds');

        return {
          ...rankingItem,
          time: rankingItem.results
            .reduce((acc, result) => {
              const time = dayjs.duration(result.time, 'seconds');
              const bonus = dayjs.duration(result.bonus, 'seconds');

              return acc.subtract(time).subtract(bonus);
            }, totalTime.add(penalty))
            .asSeconds(),
        };
      })
      .sort((a, b) => a.time - b.time);
  });

  /**
   * Get the rank of each team by station.
   *
   * @param stations - The stations
   * @returns The rank of each team by station
   */
  private getRankByTeamByStation(
    stations: Station[],
    teams: Team[]
  ): RankByTeamByStation {
    return stations.reduce<RankByTeamByStation>((acc, station) => {
      const rankByTeam = StationUtils.getResultsForTeamsWithRank(
        station,
        teams
      ).reduce<RankByTeam>(
        (acc, result) => ({
          ...acc,
          [result.teamId]: result.rank,
        }),
        {}
      );

      return {
        ...acc,
        [station.id]: rankByTeam,
      };
    }, {});
  }

  private getStationResultsOfTeam(
    team: Team,
    stations: Station[],
    rankByTeamByStation: RankByTeamByStation
  ): StationResult[] {
    return stations.map((station) => {
      const result = team.results.find(
        (result) => result.stationId === station.id
      );

      const rank = rankByTeamByStation[station.id]?.[team.id] ?? 0;

      return {
        bonus: StationUtils.getBonusForRank(rank),
        stationId: station.id,
        time: result?.checkOut?.diff(result.checkIn, 'seconds') ?? 0,
      };
    });
  }
}
