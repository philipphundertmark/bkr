import dayjs from 'dayjs';

import { ResultWithRank } from './result';
import { ResultUtils } from './result.utils';
import { Station, StationWithResults } from './station';
import { StationDTO } from './station.dto';
import { Team } from './team';

const TIME_BONUS = [
  // 1st place
  5 * 60,
  // 2nd place
  4 * 60,
  // 3rd place
  3 * 60,
  // 4th place
  2 * 60,
  // 5th place
  1 * 60,
];

export const StationUtils = {
  deserialize(dto: StationDTO): Station {
    return {
      id: dto.id,
      createdAt: dayjs(dto.createdAt),
      updatedAt: dayjs(dto.updatedAt),
      name: dto.name,
      number: dto.number,
      members: dto.members,
      code: dto.code,
      order: dto.order,
    };
  },
  serialize(station: Station): StationDTO {
    return {
      id: station.id,
      createdAt: station.createdAt.toISOString(),
      updatedAt: station.updatedAt.toISOString(),
      name: station.name,
      number: station.number,
      members: station.members,
      code: station.code,
      order: station.order,
    };
  },
  formatStationMembers(station: Station): string {
    if (!station.members.length) {
      return 'Keine Mitglieder';
    }

    return station.members.join(', ');
  },
  getBonusForRank(rank: number): number {
    return TIME_BONUS[rank - 1] ?? 0;
  },
  getResultsForTeamsWithRank(
    station: StationWithResults,
    teams: Team[],
  ): ResultWithRank[] {
    let currentRank = 0;

    return station.results
      .filter((result) => teams.some((team) => team.id === result.teamId))
      .filter(ResultUtils.isFinal)
      .sort((a, b) =>
        station.order === 'ASC' ? a.points - b.points : b.points - a.points,
      )
      .map((result, index, allResults) => {
        const previousResult = allResults[index - 1];

        if (previousResult?.points !== result.points) {
          currentRank = index + 1;
        }

        return {
          ...result,
          rank: currentRank,
        };
      });
  },
};
