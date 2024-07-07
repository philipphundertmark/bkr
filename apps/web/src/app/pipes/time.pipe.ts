import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  standalone: true,
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: dayjs.Dayjs): string {
    return value.format('HH:mm:ss');
  }
}
