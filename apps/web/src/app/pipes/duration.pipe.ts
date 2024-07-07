import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  standalone: true,
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return dayjs.duration(value, 'seconds').format('HH:mm:ss');
  }
}
