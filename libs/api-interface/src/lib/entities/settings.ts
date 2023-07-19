import * as dayjs from 'dayjs';

export interface Settings {
  id: string;
  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
  publishResults: boolean;
}
