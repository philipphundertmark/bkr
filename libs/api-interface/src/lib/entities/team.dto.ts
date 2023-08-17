import { ResultDTO } from './result.dto';

export interface TeamDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  number: number;
  members: string[];
  startedAt?: string;
  finishedAt?: string;
  help: boolean;
  penalty: number;
  results: ResultDTO[];
}
