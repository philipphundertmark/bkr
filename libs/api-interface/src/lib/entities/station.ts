import * as dayjs from 'dayjs';

import { Order } from '../order';
import { Result } from './result';

export interface Station {
  id: string;
  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
  name: string;
  number: number;
  members: string[];
  code?: string;
  order: Order;
  results: Result[];
}
