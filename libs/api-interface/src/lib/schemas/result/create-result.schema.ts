import joi from 'joi';

export interface CreateResultSchema {
  teamId: string;
}

export const CreateResultSchema: joi.ObjectSchema<CreateResultSchema> =
  joi.object({
    teamId: joi.string().uuid().required(),
  });
