import { PrismaClient, Team as PrismaTeam } from '@prisma/client';
import dayjs from 'dayjs';

import { Team } from '@bkr/api-interface';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(
    name: string,
    number: number,
    members: string[],
    help: boolean,
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        name: name,
        number: number,
        members: members,
        help: help,
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
    const teams = await this.prisma.team.findMany({});

    return teams.map((team) => this.toTeam(team));
  }

  async getTeamById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: id,
      },
    });

    return team ? this.toTeam(team) : null;
  }

  async getTeamByNumber(number: number): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        number: number,
      },
    });

    return team ? this.toTeam(team) : null;
  }

  async scheduleTeams(start: string, interval: number): Promise<Team[]> {
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
        }),
      ),
    );

    const shuffledTeams = teams.sort(() => Math.random() - 0.5);
    let startedAt = dayjs(start);

    const updatedTeams = await this.prisma.$transaction(
      shuffledTeams.map((team, index) =>
        this.prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            finishedAt: null,
            number: index + 1,
            startedAt: (index === 0
              ? startedAt
              : (startedAt = startedAt.add(interval, 'minute'))
            ).toDate(),
          },
        }),
      ),
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
    },
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
    });

    return this.toTeam(team);
  }

  private toTeam(team: PrismaTeam): Team {
    return {
      ...team,
      createdAt: dayjs(team.createdAt),
      updatedAt: dayjs(team.updatedAt),
      startedAt: team.startedAt ? dayjs(team.startedAt) : undefined,
      finishedAt: team.finishedAt ? dayjs(team.finishedAt) : undefined,
    };
  }
}
