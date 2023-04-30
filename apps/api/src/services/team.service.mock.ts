import { MockType } from '../mock-type';
import { TeamService } from './team.service';

export const teamServiceMock: MockType<TeamService> = {
  createTeam: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  deleteTeam: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getAll: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getTeamById: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getTeamByNumber: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  updateTeam: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
};
