import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import dayjs from 'dayjs';

import {
  Station,
  StationUtils,
  StationWithResults,
  TeamUtils,
  TeamWithResults,
} from '@bkr/api-interface';

import { EmptyComponent } from '../empty/empty.component';
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
  imports: [CommonModule, EmptyComponent, RankingItemComponent],
  host: { class: 'list' },
  styleUrl: './ranking.component.scss',
  templateUrl: './ranking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  ranking = input.required<string>();
  stations = input.required<StationWithResults[]>();
  teams = input.required<TeamWithResults[]>();

  teamsForRanking = computed(() =>
    this.teams().filter((team) =>
      this.ranking() === 'standard' ? !team.help : team.help,
    ),
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
            rankByTeamByStation,
          ),
          totalTime: TeamUtils.getTime(team),
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
    stations: StationWithResults[],
    teams: TeamWithResults[],
  ): RankByTeamByStation {
    return stations.reduce<RankByTeamByStation>((acc, station) => {
      const rankByTeam = StationUtils.getResultsForTeamsWithRank(
        station,
        teams,
      ).reduce<RankByTeam>(
        (acc, result) => ({
          ...acc,
          [result.teamId]: result.rank,
        }),
        {},
      );

      return {
        ...acc,
        [station.id]: rankByTeam,
      };
    }, {});
  }

  private getStationResultsOfTeam(
    team: TeamWithResults,
    stations: Station[],
    rankByTeamByStation: RankByTeamByStation,
  ): StationResult[] {
    return stations.map((station) => {
      const result = team.results.find(
        (result) => result.stationId === station.id,
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
