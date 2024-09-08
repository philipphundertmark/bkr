import joi from 'joi';

import { Order } from '../../order';

export interface UpdateStationSchema {
  name?: string;
  number?: number;
  members?: string[];
  code?: string;
  order?: Order;
}

export const UpdateStationSchema: joi.ObjectSchema<UpdateStationSchema> =
  joi.object({
    name: joi.string(),
    number: joi.number().min(1),
    members: joi.array().items(joi.string()),
    code: joi.string().length(6),
    order: joi.string().valid(Order.ASC, Order.DESC),
  });
