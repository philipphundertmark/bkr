import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import {
  AlertComponent,
  ButtonComponent,
  EmptyComponent,
  RankingComponent,
  TabComponent,
  TabsComponent,
} from '../../components';
import {
  LockClosedIconComponent,
  LockOpenIconComponent,
  TrophyIconComponent,
} from '../../icons/mini';
import { SettingsService } from '../../services';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-endresult',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LockClosedIconComponent,
    LockOpenIconComponent,
    RankingComponent,
    RouterModule,
    TabComponent,
    TabsComponent,
    TrophyIconComponent,
  ],
  templateUrl: './endresult.component.html',
  styleUrls: ['./endresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndresultComponent {
  @HostBinding('class.page') page = true;

  ranking = signal('standard');

  stations = this.store.stations;
  teams = this.store.teams;

  publishResults = this.store.publishResults;
  isRaceOver = this.store.raceIsOver;

  hideResultsLoading = signal(false);
  publishResultsLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly store: Store,
  ) {}

  handleChangeRanking(ranking: string): void {
    this.ranking.set(ranking);
  }

  handlePublishResults(): void {
    this.publishResultsLoading.set(true);

    this.settingsService
      .updateSettings({ publishResults: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          window.plausible('Publish Results');

          this.publishResultsLoading.set(false);
        },
      });
  }

  handleHideResults(): void {
    this.hideResultsLoading.set(true);

    this.settingsService
      .updateSettings({ publishResults: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          window.plausible('Hide Results');

          this.hideResultsLoading.set(false);
        },
      });
  }
}
