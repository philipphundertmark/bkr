import dayjs from 'dayjs';

export interface Result {
  /**
   * ID of the station at which the result was created.
   */
  stationId: string;

  /**
   * ID of the team for which the result was created.
   */
  teamId: string;

  /**
   * The date the team checked in at the station.
   */
  checkIn: dayjs.Dayjs;

  /**
   * The date the team checked out at the station. If not set, the team has not checked out yet.
   */
  checkOut?: dayjs.Dayjs;

  /**
   * The points the team got at the station.
   */
  points: number;
}

export type ResultWithRank = Result & {
  rank: number;
};
