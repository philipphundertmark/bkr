import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Station, Team } from '@bkr/api-interface';

import {
  AlertComponent,
  ButtonComponent,
  EmptyComponent,
  RankingComponent,
} from '../../components';
import {
  LockClosedIconComponent,
  LockOpenIconComponent,
  TrophyIconComponent,
} from '../../icons/mini';
import { SettingsService, StationService, TeamService } from '../../services';

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
    TrophyIconComponent,
  ],
  templateUrl: './endresult.component.html',
  styleUrls: ['./endresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndresultComponent {
  @HostBinding('class.page') page = true;

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  isRaceOver = toSignal(this.teamService.isRaceOver$, { initialValue: false });
  publishResults = toSignal(this.settingsService.publishResults$, {
    initialValue: false,
  });

  hideResultsLoading = signal(false);
  publishResultsLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  handlePublishResults(): void {
    this.publishResultsLoading.set(true);

    this.settingsService
      .updateSettings({ publishResults: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
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
          this.hideResultsLoading.set(false);
        },
      });
  }
}
