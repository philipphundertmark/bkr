import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  standalone: true,
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: dayjs.Dayjs | null | undefined): string {
    if (!value) {
      return '-';
    }

    return value.format('DD.MM.YYYY HH:mm:ss');
  }
}
