import { Order } from '../order';
import { ResultDTO } from './result.dto';

export interface StationDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  number: number;
  members: string[];
  code?: string;
  order: Order;
  results: ResultDTO[];
}
