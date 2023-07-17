import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { BehaviorSubject } from 'rxjs';

import { Order, Station, Team } from '@bkr/api-interface';

interface BonusByTeam {
  [teamId: string]: number;
}

interface BonusByTeamByStation {
  [stationId: string]: BonusByTeam;
}

interface StationResult {
  bonus: number;
  stationId: string;
  time: number;
}

interface RankingItem {
  // Name of the team
  name: string;
  // Penalty time in seconds
  penalty: number;
  results: StationResult[];
  // Time in seconds
  time: number;
  // Total time in seconds
  totalTime: number;
}

const TIME_BONUS = [5 * 60, 4 * 60, 3 * 60, 2 * 60, 1 * 60];

@Component({
  selector: 'bkr-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
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

  stations$ = new BehaviorSubject<Station[]>([]);
  teams$ = new BehaviorSubject<Team[]>([]);

  stations = toSignal(this.stations$, { initialValue: [] as Station[] });
  teams = toSignal(this.teams$, { initialValue: [] as Team[] });

  rankingItems = computed(() => {
    const stations = this.stations();
    const teams = this.teams();

    const stationBonus = stations.reduce((acc, station) => {
      const bonusByTeam = station.results
        .filter((result) => result.checkOut)
        .sort((a, b) => {
          return station.order === Order.ASC
            ? a.points - b.points
            : b.points - a.points;
        })
        .reduce((acc, result, index) => {
          return {
            ...acc,
            [result.teamId]: TIME_BONUS[index] ?? 0,
          };
        }, {} as BonusByTeam);

      return {
        ...acc,
        [station.id]: bonusByTeam,
      };
    }, {} as BonusByTeamByStation);

    return teams
      .map((team): Omit<RankingItem, 'time'> => {
        return {
          name: team.name,
          penalty: team.penalty * 60,
          results: stations.map((station) => {
            const result = team.results.find(
              (result) => result.stationId === station.id
            );

            return {
              bonus: stationBonus[station.id]?.[team.id] ?? 0,
              stationId: station.id,
              time: result?.checkOut?.diff(result.checkIn, 'seconds') ?? 0,
            };
          }),
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

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }

  getFormattedBonusAtStation(
    stationId: string,
    rankingItem: RankingItem
  ): string {
    const stationResult = rankingItem.results.find(
      (result) => result.stationId === stationId
    );

    if (!stationResult) {
      return '00:00:00';
    }

    return this.formatDuration(stationResult.bonus);
  }

  getFormattedTimeAtStation(
    stationId: string,
    rankingItem: RankingItem
  ): string {
    const stationResult = rankingItem.results.find(
      (result) => result.stationId === stationId
    );

    if (!stationResult) {
      return '00:00:00';
    }

    return this.formatDuration(stationResult.time);
  }
}
