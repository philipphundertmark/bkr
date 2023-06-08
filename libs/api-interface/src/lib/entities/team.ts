import * as dayjs from 'dayjs';

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
}
