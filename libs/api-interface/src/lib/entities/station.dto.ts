import { Order } from '../order';

export interface StationDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  number: number;
  members: string[];
  code?: string;
  order: Order;
}
