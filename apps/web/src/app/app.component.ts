import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { LoadingComponent } from './components';
import {
  FlagIconComponent,
  StarIconComponent,
  UserIconComponent,
} from './icons/mini';
import {
  ResultService,
  SettingsService,
  StationService,
  TeamService,
} from './services';
import { AuthService } from './services/auth.service';
import { Store } from './services/store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FlagIconComponent,
    LoadingComponent,
    StarIconComponent,
    RouterModule,
    UserIconComponent,
  ],
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isAdmin = toSignal(this.authService.isAdmin$);
  isStation = toSignal(this.authService.isStation$);

  resultsError = this.store.resultsError;
  settingsError = this.store.settingsError;
  stationsError = this.store.stationsError;
  teamsError = this.store.teamsError;

  hasError = computed(
    () =>
      this.resultsError() !== null ||
      this.settingsError() !== null ||
      this.stationsError() !== null ||
      this.teamsError() !== null,
  );

  resultsLoading = this.store.resultsLoading;
  settingsLoading = this.store.settingsLoading;
  stationsLoading = this.store.stationsLoading;
  teamsLoading = this.store.teamsLoading;

  loading = computed(
    () =>
      this.resultsLoading() ||
      this.settingsLoading() ||
      this.stationsLoading() ||
      this.teamsLoading(),
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly resultService: ResultService,
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.store.setResultsLoading(true);

    this.resultService
      .getResults()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => this.store.setResults(results),
        error: (error) => this.store.setResultsError(error),
        complete: () => this.store.setResultsLoading(false),
      });

    this.store.setSettingsLoading(true);

    this.settingsService
      .getSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => this.store.setSettings(settings),
        error: (error) => this.store.setSettingsError(error),
        complete: () => this.store.setSettingsLoading(false),
      });

    this.store.setStationsLoading(true);

    this.stationService
      .getStations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stations) => this.store.setStations(stations),
        error: (error) => this.store.setStationsError(error),
        complete: () => this.store.setStationsLoading(false),
      });

    this.store.setTeamsLoading(true);

    this.teamService
      .getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teams) => this.store.setTeams(teams),
        error: (error) => this.store.setTeamsError(error),
        complete: () => this.store.setTeamsLoading(false),
      });
  }

  handleAuth(): void {
    if (this.router.url.startsWith('/auth')) {
      // We are already on the auth page.
      return;
    }

    this.router.navigate(['/auth'], {
      queryParams: {
        returnUrl: this.router.url,
      },
    });
  }
}
