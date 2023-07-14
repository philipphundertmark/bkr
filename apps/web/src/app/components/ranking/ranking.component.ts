import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { BehaviorSubject } from 'rxjs';

import { Station, Team } from '@bkr/api-interface';

interface RankingItem {
  name: string;
  time: number;
}

@Component({
  selector: 'bkr-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'stations', required: true })
  set _stations(value: Station[]) {
    this.stations$.next(value);
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'teams', required: true })
  set _teams(value: Team[]) {
    this.teams$.next(value);
  }

  stations$ = new BehaviorSubject<Station[]>([]);
  teams$ = new BehaviorSubject<Team[]>([]);

  stations = toSignal(this.stations$, { initialValue: [] as Station[] });
  teams = toSignal(this.teams$, { initialValue: [] as Team[] });

  rankingItems = computed(() => {
    return [] as RankingItem[];
  });

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }
}
