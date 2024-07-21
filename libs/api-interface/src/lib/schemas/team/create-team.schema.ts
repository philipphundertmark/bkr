import joi from 'joi';

import { Ranking } from '../../ranking';

export interface CreateTeamSchema {
  name: string;
  number: number;
  members: string[];
  ranking: Ranking;
}

export const CreateTeamSchema: joi.ObjectSchema<CreateTeamSchema> = joi.object({
  name: joi.string().min(3).required(),
  number: joi.number().min(1).required(),
  members: joi.array().items(joi.string()).required(),
  ranking: joi.string().valid(Ranking.A, Ranking.B).required(),
});
