import dayjs from 'dayjs';

import { Order } from '../order';
import { Result } from './result';

export interface Station {
  /**
   * UUID of the station.
   */
  id: string;

  /**
   * The date the station was created.
   */
  createdAt: dayjs.Dayjs;

  /**
   * The date the station was last updated.
   */
  updatedAt: dayjs.Dayjs;

  /**
   * The name of the station.
   */
  name: string;

  /**
   * The number of the station. Must be unique.
   */
  number: number;

  /**
   * The members of the station.
   */
  members: string[];

  /**
   * The code of the station. Must be unique. Only accessible to admins.
   */
  code?: string;

  /**
   * The order in which results of teams are sorted.
   */
  order: Order;

  /**
   * Results of teams at the station.
   */
  results: Result[];
}
