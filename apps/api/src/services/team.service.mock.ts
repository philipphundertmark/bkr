/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockType } from '../test-utils';
import { TeamService } from './team.service';

export const teamServiceMock: MockType<TeamService> = {
  createTeam: jest.fn(async (...args) => {
    throw new Error('createTeam not implemented');
  }),
  deleteTeam: jest.fn(async (...args) => {
    throw new Error('deleteTeam not implemented');
  }),
  getAll: jest.fn(async (...args) => {
    throw new Error('getAll not implemented');
  }),
  getTeamById: jest.fn(async (...args) => {
    throw new Error('getTeamById not implement');
  }),
  getTeamByNumber: jest.fn(async (...args) => {
    throw new Error('getTeamByNumber not implemented');
  }),
  updateTeam: jest.fn(async (...args) => {
    throw new Error('updateTeam not implemented');
  }),
};
