import joi from 'joi';

export interface CreateTokenSchema {
  code: string;
}

export const CreateTokenSchema: joi.ObjectSchema<CreateTokenSchema> =
  joi.object({
    code: joi.string().required(),
  });
