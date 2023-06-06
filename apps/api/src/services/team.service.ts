import { PrismaClient, Team } from '@prisma/client';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  createTeam(name: string, number: number, members: string[]): Promise<Team> {
    return this.prisma.team.create({
      data: {
        name: name,
        number: number,
        members: members,
      },
    });
  }

  async deleteTeam(id: string): Promise<void> {
    await this.prisma.team.delete({
      where: {
        id: id,
      },
    });
  }

  getAll(): Promise<Team[]> {
    return this.prisma.team.findMany();
  }

  getTeamById(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: {
        id: id,
      },
    });
  }

  getTeamByNumber(number: number): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: {
        number: number,
      },
    });
  }

  updateTeam(
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
    return this.prisma.team.update({
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
    });
  }
}
