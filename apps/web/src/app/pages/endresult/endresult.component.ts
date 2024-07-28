import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Ranking } from '@bkr/api-interface';

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
import {
  NotificationService,
  PreferencesService,
  SettingsService,
} from '../../services';
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
  host: { class: 'page' },
  styleUrl: './endresult.component.scss',
  templateUrl: './endresult.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndresultComponent {
  readonly Ranking = Ranking;

  ranking = this.preferencesService.endresultSelectedRanking;

  stations = this.store.stations;
  teams = this.store.teams;

  publishResults = this.store.publishResults;
  isRaceOver = this.store.raceIsOver;

  hideResultsLoading = signal(false);
  publishResultsLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly preferencesService: PreferencesService,
    private readonly settingsService: SettingsService,
    private readonly store: Store,
  ) {}

  handlePublishResults(): void {
    this.publishResultsLoading.set(true);

    this.settingsService
      .updateSettings({ publishResults: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.publishResultsLoading.set(false);
          this.store.setSettings(settings);
        },
        error: () => {
          this.publishResultsLoading.set(false);
          this.notificationService.error('Das hat leider nicht funktioniert');
        },
      });
  }

  handleHideResults(): void {
    this.hideResultsLoading.set(true);

    this.settingsService
      .updateSettings({ publishResults: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.hideResultsLoading.set(false);
          this.store.setSettings(settings);
        },
        error: () => {
          this.hideResultsLoading.set(false);
          this.notificationService.error('Das hat leider nicht funktioniert');
        },
      });
  }
}
