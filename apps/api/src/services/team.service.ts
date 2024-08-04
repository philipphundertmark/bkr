import { PrismaClient, Team as PrismaTeam } from '@prisma/client';
import dayjs from 'dayjs';

import { Ranking, Team } from '@bkr/api-interface';

export interface ITeamService {
  /**
   * Creates a team with the specified properties.
   *
   * @param name - The name of the team.
   * @param number - The number of the team.
   * @param members - The members of the team.
   * @param ranking - The ranking the team is participating in.
   */
  createTeam(
    name: string,
    number: number,
    members: string[],
    ranking: Ranking,
  ): Promise<Team>;

  /**
   * Deletes the team with the specified ID.
   *
   * @param id - The ID of the team to delete.
   */
  deleteTeam(id: string): Promise<void>;

  /**
   * Returns all teams.
   */
  getAll(): Promise<Team[]>;

  /**
   * Returns the team with the specified ID.
   *
   * @param id - The ID of the team to retrieve.
   */
  getTeamById(id: string): Promise<Team | null>;

  /**
   * Returns the team with the specified number.
   * If no team with the specified number exists, null is returned.
   *
   * @param number - The number of the team to retrieve.
   */
  getTeamByNumber(number: number): Promise<Team | null>;

  /**
   * Schedules the teams with the specified start time and interval.
   * This also shuffles the teams.
   *
   * @param start - The start time of the first team.
   * @param interval - The interval between the teams in minutes.
   */
  scheduleTeams(start: string, interval: number): Promise<Team[]>;

  /**
   * Updates the team with the specified ID.
   *
   * @param id - The ID of the team to update.
   * @param updates - The updates to apply to the team.
   */
  updateTeam(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      startedAt?: string | null;
      finishedAt?: string | null;
      ranking?: Ranking;
      penalty?: number;
    },
  ): Promise<Team>;
}

export class TeamService implements ITeamService {
  constructor(private prisma: PrismaClient) {}

  /**
   * @implements {ITeamService}
   */
  async createTeam(
    name: string,
    number: number,
    members: string[],
    ranking: Ranking,
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        name: name,
        number: number,
        members: members,
        ranking: ranking,
      },
    });

    return this.toTeam(team);
  }

  /**
   * @implements {ITeamService}
   */
  async deleteTeam(id: string): Promise<void> {
    await this.prisma.team.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * @implements {ITeamService}
   */
  async getAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({});

    return teams.map((team) => this.toTeam(team));
  }

  /**
   * @implements {ITeamService}
   */
  async getTeamById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: id,
      },
    });

    return team ? this.toTeam(team) : null;
  }

  /**
   * @implements {ITeamService}
   */
  async getTeamByNumber(number: number): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        number: number,
      },
    });

    return team ? this.toTeam(team) : null;
  }

  /**
   * @implements {ITeamService}
   */
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

  /**
   * @implements {ITeamService}
   */
  async updateTeam(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      startedAt?: string | null;
      finishedAt?: string | null;
      ranking?: Ranking;
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
        ranking: updates.ranking,
        penalty: updates.penalty,
      },
    });

    return this.toTeam(team);
  }

  /**
   * Converts a team read from the database to a team object.
   *
   * @param team - The team read from the database.
   * @returns The team object.
   */
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
