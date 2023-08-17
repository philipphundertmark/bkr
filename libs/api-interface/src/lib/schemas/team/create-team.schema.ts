import joi from 'joi';

export interface CreateTeamSchema {
  name: string;
  number: number;
  members: string[];
  help: boolean;
}

export const CreateTeamSchema: joi.ObjectSchema<CreateTeamSchema> = joi.object({
  name: joi.string().min(3).required(),
  number: joi.number().min(1).required(),
  members: joi.array().items(joi.string()).required(),
  help: joi.boolean().required(),
});
