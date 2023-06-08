import * as dayjs from 'dayjs';

export interface Result {
  stationId: string;
  teamId: string;
  checkIn: dayjs.Dayjs;
  checkOut?: dayjs.Dayjs;
  points: number;
}
