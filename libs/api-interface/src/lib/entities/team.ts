import dayjs from 'dayjs';

import { Result } from './result';

export interface Team {
  /**
   * UUID of the team.
   */
  id: string;

  /**
   * The date the team was created.
   */
  createdAt: dayjs.Dayjs;

  /**
   * The date the team was last updated.
   */
  updatedAt: dayjs.Dayjs;

  /**
   * The name of the team.
   */
  name: string;

  /**
   * The number of the team. Must be unique.
   */
  number: number;

  /**
   * The members of the team.
   */
  members: string[];

  /**
   * The date the team started the race. If not set, the team has not started yet.
   */
  startedAt?: dayjs.Dayjs;

  /**
   * The date the team finished the race. If not set, the team has not finished yet.
   */
  finishedAt?: dayjs.Dayjs;

  /**
   * Whether the team uses any kind of help.
   */
  help: boolean;

  /**
   * The penalty time of the team in minutes.
   */
  penalty: number;
}

export interface TeamWithResults extends Team {
  /**
   * The results of the team.
   */
  results: Result[];
}
