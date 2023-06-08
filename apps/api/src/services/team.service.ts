import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

import { Team } from '@bkr/api-interface';

import { ResultService } from './result.service';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(
    name: string,
    number: number,
    members: string[]
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        name: name,
        number: number,
        members: members,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return {
      ...team,
      createdAt: dayjs(team.createdAt),
      updatedAt: dayjs(team.updatedAt),
      startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
      finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
      results: team.results.map((result) => ({
        ...result,
        checkIn: dayjs(result.checkIn),
        checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
      })),
    };
  }

  async deleteTeam(id: string): Promise<void> {
    await this.prisma.team.delete({
      where: {
        id: id,
      },
    });
  }

  async getAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return teams.map((team) => ({
      ...team,
      createdAt: dayjs(team.createdAt),
      updatedAt: dayjs(team.updatedAt),
      startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
      finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
      results: team.results.map((result) => ({
        ...result,
        checkIn: dayjs(result.checkIn),
        checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
      })),
    }));
  }

  async getTeamById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: id,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return team
      ? {
          ...team,
          createdAt: dayjs(team.createdAt),
          updatedAt: dayjs(team.updatedAt),
          startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
          finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
          results: team.results.map((result) => ({
            ...result,
            checkIn: dayjs(result.checkIn),
            checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
          })),
        }
      : null;
  }

  async getTeamByNumber(number: number): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        number: number,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return team
      ? {
          ...team,
          createdAt: dayjs(team.createdAt),
          updatedAt: dayjs(team.updatedAt),
          startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
          finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
          results: team.results.map((result) => ({
            ...result,
            checkIn: dayjs(result.checkIn),
            checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
          })),
        }
      : null;
  }

  async updateTeam(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      startedAt?: string;
      finishedAt?: string;
      penalty?: number;
    }
  ): Promise<Team> {
    const team = await this.prisma.team.update({
      where: {
        id: id,
      },
      data: {
        name: updates.name,
        number: updates.number,
        members: updates.members,
        ...(updates.startedAt
          ? { startedAt: new Date(updates.startedAt) }
          : {}),
        ...(updates.finishedAt
          ? { finishedAt: new Date(updates.finishedAt) }
          : {}),
        penalty: updates.penalty,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return {
      ...team,
      createdAt: dayjs(team.createdAt),
      updatedAt: dayjs(team.updatedAt),
      startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
      finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
      results: team.results.map((result) => ({
        ...result,
        checkIn: dayjs(result.checkIn),
        checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
      })),
    };
  }
}
