import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { LiveEventType } from '@bkr/api-interface';

import { LoadingComponent } from './components';
import {
  FlagIconComponent,
  StarIconComponent,
  UserIconComponent,
} from './icons/mini';
import {
  LiveService,
  ResultService,
  SettingsService,
  StationService,
  TeamService,
} from './services';
import { AuthService } from './services/auth.service';
import { Store } from './services/store';

@Component({
  selector: 'bkr-root',
  standalone: true,
  imports: [
    CommonModule,
    FlagIconComponent,
    LoadingComponent,
    StarIconComponent,
    RouterModule,
    UserIconComponent,
  ],
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isAdmin = toSignal(this.authService.isAdmin$);
  isStation = toSignal(this.authService.isStation$);

  connected = this.liveService.connected;

  resultsError = signal<Error | null>(null);
  settingsError = signal<Error | null>(null);
  stationsError = signal<Error | null>(null);
  teamsError = signal<Error | null>(null);

  hasError = computed(
    () =>
      this.resultsError() !== null ||
      this.settingsError() !== null ||
      this.stationsError() !== null ||
      this.teamsError() !== null,
  );

  resultsLoading = signal<boolean>(false);
  settingsLoading = signal<boolean>(false);
  stationsLoading = signal<boolean>(false);
  teamsLoading = signal<boolean>(false);

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
    private readonly liveService: LiveService,
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
    this.liveService
      .listen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          switch (event.type) {
            case LiveEventType.DELETE_RESULT:
              this.store.deleteResult(event.stationId, event.teamId);
              break;
            case LiveEventType.DELETE_RESULTS_OF_TEAM:
              this.store.deleteResultsByTeamId(event.teamId);
              break;
            case LiveEventType.SET_RESULT:
              this.store.setResult(event.result);
              break;
            case LiveEventType.SET_SETTINGS:
              this.store.setSettings(event.settings);
              break;
            case LiveEventType.DELETE_STATION:
              this.store.deleteStation(event.stationId);
              break;
            case LiveEventType.SET_STATION:
              this.store.setStation(event.station);
              break;
            case LiveEventType.DELETE_TEAM:
              this.store.deleteTeam(event.teamId);
              break;
            case LiveEventType.SET_TEAM:
              this.store.setTeam(event.team);
              break;
            case LiveEventType.SET_TEAMS:
              this.store.setTeams(event.teams);
              break;
          }
        },
      });

    this.resultsLoading.set(true);

    this.resultService
      .getResults()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => this.store.setResults(results),
        error: (error) => this.resultsError.set(error),
        complete: () => this.resultsLoading.set(false),
      });

    this.settingsLoading.set(true);

    this.settingsService
      .getSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => this.store.setSettings(settings),
        error: (error) => this.settingsError.set(error),
        complete: () => this.settingsLoading.set(false),
      });

    this.stationsLoading.set(true);

    this.stationService
      .getStations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stations) => this.store.setStations(stations),
        error: (error) => this.stationsError.set(error),
        complete: () => this.stationsLoading.set(false),
      });

    this.teamsLoading.set(true);

    this.teamService
      .getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (teams) => this.store.setTeams(teams),
        error: (error) => this.teamsError.set(error),
        complete: () => this.teamsLoading.set(false),
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
