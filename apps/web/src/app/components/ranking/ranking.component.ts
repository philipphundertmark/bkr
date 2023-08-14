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

import { Station, StationUtils, Team } from '@bkr/api-interface';

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
  @Input({ alias: 'stations', required: true })
  set _stations(value: Station[]) {
    this.stations$.next(value);
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'teams', required: true })
  set _teams(value: Team[]) {
    this.teams$.next(value);
  }

  @Input({ required: true }) timeBonus: number[] = [];

  @HostBinding('class.list') list = true;

  stations$ = new BehaviorSubject<Station[]>([]);
  teams$ = new BehaviorSubject<Team[]>([]);

  stations = toSignal(this.stations$, { initialValue: [] as Station[] });
  teams = toSignal(this.teams$, { initialValue: [] as Team[] });

  rankingItems = computed(() => {
    const stations = this.stations();
    const teams = this.teams();

    const rankByTeamByStation = stations.reduce((acc, station) => {
      const rankByTeam = StationUtils.getResultsWithRank(station).reduce(
        (acc, result) => ({
          ...acc,
          [result.teamId]: result.rank,
        }),
        {} as RankByTeam
      );

      return {
        ...acc,
        [station.id]: rankByTeam,
      };
    }, {} as RankByTeamByStation);

    return teams
      .map((team): Omit<RankingItem, 'time'> => {
        return {
          name: team.name,
          number: team.number,
          penalty: team.penalty * 60,
          results: stations.map((station) => {
            const result = team.results.find(
              (result) => result.stationId === station.id
            );

            const rank = rankByTeamByStation[station.id]?.[team.id] ?? 0;

            return {
              bonus: rank > 0 ? this.timeBonus.at(rank - 1) ?? 0 : 0,
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
}
