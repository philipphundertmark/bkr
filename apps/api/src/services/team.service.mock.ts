/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockType } from '../test-utils';
import { TeamService } from './team.service';

export const teamServiceMock: MockType<TeamService> = {
  createTeam: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
  deleteTeam: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
  getAll: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
  getTeamById: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
  getTeamByNumber: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
  updateTeam: jest.fn(async (...args) => {
    throw new Error('Not implemented');
  }),
};
