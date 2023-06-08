import * as dayjs from 'dayjs';

import { ResultUtils } from './result.utils';
import { Station } from './station';
import { StationDTO } from './station.dto';

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
      results: dto.results.map((resultDto) =>
        ResultUtils.deserialize(resultDto)
      ),
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
      results: station.results.map((result) => ResultUtils.serialize(result)),
    };
  },
};
