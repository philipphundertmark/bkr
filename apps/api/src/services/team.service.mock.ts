/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Ranking, Team } from '@bkr/api-interface';

import { ITeamService } from './team.service';

export const teamServiceMock = {
  createTeam: jest.fn(),
  deleteTeam: jest.fn(),
  getAll: jest.fn(),
  getTeamById: jest.fn(),
  getTeamByNumber: jest.fn(),
  scheduleTeams: jest.fn(),
  updateTeam: jest.fn(),
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
