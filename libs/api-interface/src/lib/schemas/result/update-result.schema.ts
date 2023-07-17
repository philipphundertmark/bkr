import * as joi from 'joi';

export interface UpdateResultSchema {
  checkIn?: string;
  checkOut?: string | null;
  points?: number;
}

export const UpdateResultSchema: joi.ObjectSchema<UpdateResultSchema> =
  joi.object({
    checkIn: joi.string().isoDate(),
    checkOut: joi.string().isoDate().allow(null),
    points: joi.number().min(0),
  });
