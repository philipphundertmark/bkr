import * as dayjs from 'dayjs';

import { Result } from './result';

export interface Team {
  id: string;
  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
  name: string;
  number: number;
  members: string[];
  startedAt?: dayjs.Dayjs;
  finishedAt?: dayjs.Dayjs;
  penalty: number;
  results: Result[];
}
