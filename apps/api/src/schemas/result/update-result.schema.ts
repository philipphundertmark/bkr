import * as joi from 'joi';

export interface UpdateResultSchema {
  checkIn?: string;
  checkOut?: string;
  points?: number;
}

export const UpdateResultSchema: joi.ObjectSchema<UpdateResultSchema> =
  joi.object({
    checkIn: joi.string().isoDate(),
    checkOut: joi.string().isoDate(),
    points: joi.number().min(0),
  });
