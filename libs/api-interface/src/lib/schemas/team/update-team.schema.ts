import joi from 'joi';

export interface UpdateTeamSchema {
  name?: string;
  number?: number;
  members?: string[];
  startedAt?: string | null;
  finishedAt?: string | null;
  help?: boolean;
  penalty?: number;
}

export const UpdateTeamSchema: joi.ObjectSchema<UpdateTeamSchema> = joi.object({
  name: joi.string().min(3),
  number: joi.number().min(1),
  members: joi.array().items(joi.string().min(3)),
  startedAt: joi.string().isoDate().allow(null),
  finishedAt: joi.string().isoDate().allow(null),
  help: joi.boolean(),
  penalty: joi.number().min(0),
});
