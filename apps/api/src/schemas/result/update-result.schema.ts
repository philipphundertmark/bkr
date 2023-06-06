import * as joi from 'joi';

export interface UpdateResultSchema {
  checkOut?: string;
  points?: number;
}

export const UpdateResultSchema: joi.ObjectSchema<UpdateResultSchema> =
  joi.object({
    checkOut: joi.string().isoDate(),
    points: joi.number().min(0),
  });
