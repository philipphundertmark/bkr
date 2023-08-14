import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import dayjs from 'dayjs';

import { Station } from '@bkr/api-interface';

import { ChevronRightIconComponent } from '../../../icons/mini';
import { RankingItem } from '../ranking.component';

@Component({
  selector: 'bkr-ranking-item',
  standalone: true,
  imports: [ChevronRightIconComponent, CommonModule],
  templateUrl: './ranking-item.component.html',
  styleUrls: ['./ranking-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingItemComponent {
  @Input({ required: true }) bkrRank!: number;
  @Input({ required: true }) bkrRankingItem!: RankingItem;
  @Input({ required: true }) bkrStations!: Station[];

  collapsed = signal(true);

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }

  getFormattedBonusAtStation(
    stationId: string,
    rankingItem: RankingItem
  ): string {
    const stationResult = rankingItem.results.find(
      (result) => result.stationId === stationId
    );

    if (!stationResult) {
      return '00:00:00';
    }

    return this.formatDuration(stationResult.bonus);
  }

  getFormattedTimeAtStation(
    stationId: string,
    rankingItem: RankingItem
  ): string {
    const stationResult = rankingItem.results.find(
      (result) => result.stationId === stationId
    );

    if (!stationResult) {
      return '00:00:00';
    }

    return this.formatDuration(stationResult.time);
  }

  toggleCollapsed(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }
}
