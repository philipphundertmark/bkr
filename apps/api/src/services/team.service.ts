import { PrismaClient, Team as PrismaTeam } from '@prisma/client';
import dayjs from 'dayjs';

import { Team } from '@bkr/api-interface';

import { ResultService } from './result.service';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(
    name: string,
    number: number,
    members: string[],
    help: boolean
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        name: name,
        number: number,
        members: members,
        help: help,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return this.toTeam(team);
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

    return teams.map((team) => this.toTeam(team));
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

    return team ? this.toTeam(team) : null;
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

    return team ? this.toTeam(team) : null;
  }

  async shuffleTeams(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      select: {
        id: true,
        number: true,
      },
    });

    const maxNumber = Math.max(...teams.map((team) => team.number));

    // Set intermediate numbers to avoid unique constraint errors
    await this.prisma.$transaction(
      teams.map((team) =>
        this.prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            number: team.number + maxNumber,
          },
        })
      )
    );

    const shuffledTeams = teams.sort(() => Math.random() - 0.5);

    const updatedTeams = await this.prisma.$transaction(
      shuffledTeams.map((team, index) =>
        this.prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            number: index + 1,
          },
          include: {
            results: {
              select: ResultService.RESULT_SELECT,
            },
          },
        })
      )
    );

    return updatedTeams.map((team) => this.toTeam(team));
  }

  async updateTeam(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      startedAt?: string | null;
      finishedAt?: string | null;
      help?: boolean;
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
        startedAt:
          typeof updates.startedAt === 'string'
            ? new Date(updates.startedAt)
            : updates.startedAt,
        finishedAt:
          typeof updates.finishedAt === 'string'
            ? new Date(updates.finishedAt)
            : updates.finishedAt,
        help: updates.help,
        penalty: updates.penalty,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return this.toTeam(team);
  }

  private toTeam(
    team: PrismaTeam & {
      results: {
        stationId: string;
        teamId: string;
        checkIn: Date;
        checkOut: Date | null;
        points: number;
      }[];
    }
  ): Team {
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
