/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Ranking, Team } from '@bkr/api-interface';

import { ITeamService } from './team.service';

export const teamServiceMock = {
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
  scheduleTeams: jest.fn(async (...args) => {
    throw new Error('scheduleTeams not implemented');
  }),
  updateTeam: jest.fn(async (...args) => {
    throw new Error('updateTeam not implemented');
  }),
} satisfies ITeamService;

export const mockTeam = (updates: Partial<Team>): Team => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  name: 'mock-team',
  number: 1,
  members: [],
  penalty: 0,
  ranking: Ranking.A,
  ...updates,
});
