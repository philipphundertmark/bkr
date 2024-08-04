import { Order, PrismaClient, Station as PrismaStation } from '@prisma/client';
import dayjs from 'dayjs';

import { Station } from '@bkr/api-interface';

export interface IStationService {
  /**
   * Creates a station with the specified properties.
   *
   * @param name - The name of the station.
   * @param number - The number of the station.
   * @param members - The members of the station.
   * @param code - The code of the station.
   * @param order - The order of the station.
   */
  createStation(
    name: string,
    number: number,
    members: string[],
    code: string,
    order: Order,
  ): Promise<Station>;

  /**
   * Deletes the station with the specified ID.
   *
   * @param id - The ID of the station to delete.
   */
  deleteStation(id: string): Promise<void>;

  /**
   * Returns all stations.
   */
  getAll(): Promise<Station[]>;

  /**
   * Returns the station with the specified ID.
   *
   * @param id - The ID of the station to retrieve.
   */
  getStationById(id: string): Promise<Station | null>;

  /**
   * Returns the station with the specified number.
   * If no station with the specified number exists, null is returned.
   *
   * @param number - The number of the station to retrieve.
   */
  getStationByNumber(number: number): Promise<Station | null>;

  /**
   * Returns the station with the specified code.
   * If no station with the specified code exists, null is returned.
   *
   * @param code - The code of the station to retrieve.
   */
  getStationByCode(code: string): Promise<Station | null>;

  /**
   * Updates the station with the specified ID.
   *
   * @param id - The ID of the station to update.
   * @param updates - The updates to apply to the station.
   */
  updateStation(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      code?: string;
      order?: Order;
    },
  ): Promise<Station>;
}

export class StationService implements IStationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * @implements {IStationService}
   */
  async createStation(
    name: string,
    number: number,
    members: string[],
    code: string,
    order: Order,
  ): Promise<Station> {
    const station = await this.prisma.station.create({
      data: {
        name: name,
        number: number,
        code: code,
        members: members,
        order: order,
      },
    });

    return this.toStation(station);
  }

  /**
   * @implements {IStationService}
   */
  async deleteStation(id: string): Promise<void> {
    await this.prisma.station.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * @implements {IStationService}
   */
  async getAll(): Promise<Station[]> {
    const stations = await this.prisma.station.findMany({});

    return stations.map((station) => this.toStation(station));
  }

  /**
   * @implements {IStationService}
   */
  async getStationById(id: string): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        id: id,
      },
    });

    return station ? this.toStation(station) : null;
  }

  /**
   * @implements {IStationService}
   */
  async getStationByNumber(number: number): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        number: number,
      },
    });

    return station ? this.toStation(station) : null;
  }

  /**
   * @implements {IStationService}
   */
  async getStationByCode(code: string): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        code: code,
      },
    });

    return station ? this.toStation(station) : null;
  }

  /**
   * @implements {IStationService}
   */
  async updateStation(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      code?: string;
      order?: Order;
    },
  ): Promise<Station> {
    const station = await this.prisma.station.update({
      where: {
        id: id,
      },
      data: {
        name: updates.name,
        number: updates.number,
        members: updates.members,
        code: updates.code,
        order: updates.order,
      },
    });

    return this.toStation(station);
  }

  /**
   * Converts a station read from the database to a station object.
   *
   * @param station - The station read from the database.
   * @returns The station object.
   */
  private toStation(station: PrismaStation): Station {
    return {
      ...station,
      createdAt: dayjs(station.createdAt),
      updatedAt: dayjs(station.updatedAt),
    };
  }
}
