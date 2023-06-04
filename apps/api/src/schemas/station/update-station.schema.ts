import { Order } from '@prisma/client';
import * as joi from 'joi';

export interface UpdateStationSchema {
  name?: string;
  number?: number;
  members?: string[];
  code?: string;
  order?: Order;
}

export const UpdateStationSchema: joi.ObjectSchema<UpdateStationSchema> =
  joi.object({
    name: joi.string().min(3),
    number: joi.number().min(1),
    members: joi.array().items(joi.string().min(3)),
    code: joi.string().length(6),
    order: joi.string().valid(Order.ASC, Order.DESC),
  });
