import joi from 'joi';

import { Order } from '../../order';

export interface CreateStationSchema {
  name: string;
  number: number;
  members: string[];
  code: string;
  order: Order;
}

export const CreateStationSchema: joi.ObjectSchema<CreateStationSchema> =
  joi.object({
    name: joi.string().required(),
    number: joi.number().min(1).required(),
    members: joi.array().items(joi.string()).required(),
    code: joi.string().length(6).required(),
    order: joi.string().valid(Order.ASC, Order.DESC).required(),
  });
