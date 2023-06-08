import dayjs from 'dayjs';

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
      penalty: dto.penalty,
      results: dto.results.map((resultDto) =>
        ResultUtils.deserialize(resultDto)
      ),
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
      penalty: team.penalty,
      results: team.results.map((result) => ResultUtils.serialize(result)),
    };
  },
};
