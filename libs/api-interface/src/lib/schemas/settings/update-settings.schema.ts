import * as joi from 'joi';

export interface UpdateSettingsSchema {
  publishResults?: boolean;
}

export const UpdateSettingsSchema: joi.ObjectSchema<UpdateSettingsSchema> =
  joi.object({
    publishResults: joi.boolean(),
  });
