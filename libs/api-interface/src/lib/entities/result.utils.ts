import dayjs from 'dayjs';

import { Result } from './result';
import { ResultDTO } from './result.dto';

export const ResultUtils = {
  deserialize(dto: ResultDTO): Result {
    return {
      stationId: dto.stationId,
      teamId: dto.teamId,
      checkIn: dayjs(dto.checkIn),
      checkOut: dto.checkOut ? dayjs(dto.checkOut) : undefined,
      points: dto.points,
    };
  },
  serialize(result: Result): ResultDTO {
    return {
      stationId: result.stationId,
      teamId: result.teamId,
      checkIn: result.checkIn.toISOString(),
      checkOut: result.checkOut?.toISOString(),
      points: result.points,
    };
  },
};
