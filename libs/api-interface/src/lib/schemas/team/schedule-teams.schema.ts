import joi from 'joi';

export interface ScheduleTeamsSchema {
  start: string;
  interval: number;
}

export const ScheduleTeamsSchema: joi.ObjectSchema<ScheduleTeamsSchema> =
  joi.object({
    start: joi.string().isoDate(),
    interval: joi.number().min(1),
  });
