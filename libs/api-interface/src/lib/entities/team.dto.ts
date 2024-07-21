import { Ranking } from '../ranking';

export interface TeamDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  number: number;
  members: string[];
  startedAt?: string;
  finishedAt?: string;
  ranking: Ranking;
  penalty: number;
}
