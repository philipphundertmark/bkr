import dayjs from 'dayjs';
import { SetRequired } from 'type-fest';

import { ResultUtils } from './result.utils';
import { Team } from './team';
import { TeamDTO } from './team.dto';

export const TeamUtils = {
  deserialize(dto: TeamDTO): Team {
    return {
      id: dto.id,
      createdAt: dayjs(dto.createdAt),
      updatedAt: dayjs(dto.updatedAt),
      name: dto.name,
      number: dto.number,
      members: dto.members,
      startedAt: dto.startedAt ? dayjs(dto.startedAt) : undefined,
      finishedAt: dto.finishedAt ? dayjs(dto.finishedAt) : undefined,
      help: dto.help,
      penalty: dto.penalty,
      results: dto.results.map(ResultUtils.deserialize),
    };
  },
  serialize(team: Team): TeamDTO {
    return {
      id: team.id,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      name: team.name,
      number: team.number,
      members: team.members,
      startedAt: team.startedAt?.toISOString(),
      finishedAt: team.finishedAt?.toISOString(),
      help: team.help,
      penalty: team.penalty,
      results: team.results.map(ResultUtils.serialize),
    };
  },
  isStarted(team: Team): team is SetRequired<Team, 'startedAt'> {
    return typeof team.startedAt !== 'undefined';
  },
  isFinished(team: Team): team is SetRequired<Team, 'finishedAt'> {
    return typeof team.finishedAt !== 'undefined';
  },
  isRunning(team: Team): boolean {
    return TeamUtils.isStarted(team) && !TeamUtils.isFinished(team);
  },
  formatTeamMembers(team: Team): string {
    if (!team.members.length) {
      return 'Keine Mitglieder';
    }

    return team.members.join(', ');
  },
};
