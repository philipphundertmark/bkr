import * as joi from 'joi';

export interface CreateResultSchema {
  teamId: number;
}

export const CreateResultSchema: joi.ObjectSchema<CreateResultSchema> =
  joi.object({
    teamId: joi.number().required(),
  });
