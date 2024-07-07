import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

import { Station } from '@bkr/api-interface';

import { ChevronRightIconComponent } from '../../../icons/mini';
import { DurationPipe } from '../../../pipes';
import { RankingItem } from '../ranking.component';

@Component({
  selector: 'bkr-ranking-item',
  standalone: true,
  imports: [ChevronRightIconComponent, CommonModule, DurationPipe],
  styleUrl: './ranking-item.component.scss',
  templateUrl: './ranking-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingItemComponent {
  rank = input.required<number>();
  rankingItem = input.required<RankingItem>();
  stations = input.required<Station[]>();

  collapsed = signal(true);

  getBonusAtStation(stationId: string, rankingItem: RankingItem): number {
    return (
      rankingItem.results.find((result) => result.stationId === stationId)
        ?.bonus ?? 0
    );
  }

  getTimeAtStation(stationId: string, rankingItem: RankingItem): number {
    return (
      rankingItem.results.find((result) => result.stationId === stationId)
        ?.time ?? 0
    );
  }

  toggleCollapsed(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }
}
