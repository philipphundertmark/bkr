import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { EmptyComponent } from './components';
import {
  FlagIconComponent,
  StarIconComponent,
  UserIconComponent,
} from './icons/mini';
import { SettingsService, StationService, TeamService } from './services';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    EmptyComponent,
    FlagIconComponent,
    StarIconComponent,
    RouterModule,
    UserIconComponent,
  ],
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAdmin = toSignal(this.authService.isAdmin$);
  isStation = toSignal(this.authService.isStation$);

  settingsError = toSignal(this.settingsService.error$, { initialValue: null });
  stationsError = toSignal(this.stationService.error$, { initialValue: null });
  teamsError = toSignal(this.teamService.error$, { initialValue: null });

  hasError = computed(
    () =>
      this.settingsError() !== null ||
      this.stationsError() !== null ||
      this.teamsError() !== null
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.settingsService
      .getSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.stationService
      .getStations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.teamService
      .getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
