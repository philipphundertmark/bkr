import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EMPTY, combineLatest, map, switchMap } from 'rxjs';

import { Station } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import {
  ArrowDownCircleIconComponent,
  ArrowUpCircleIconComponent,
} from '../../icons/mini';
import {
  AuthService,
  NotificationService,
  StationService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [
    ArrowDownCircleIconComponent,
    ArrowUpCircleIconComponent,
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.stationService.loading$, { initialValue: false });
  deleteStationLoading = signal(false);

  station$ = combineLatest([
    this.route.paramMap,
    this.stationService.stations$,
  ]).pipe(
    map(([params, stations]) =>
      stations.find((station) => station.id === params.get('stationId'))
    )
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stationService: StationService
  ) {}

  formatStationMembers(station: Station): string {
    if (!station.members.length) {
      return 'Keine Mitglieder';
    }

    return station.members.join(', ');
  }

  handleDeleteStation(stationId: string): void {
    this.confirmService
      .delete({
        title: 'Team löschen',
        message: 'Möchtest du das Team wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteStationLoading.set(true);

          return this.stationService.deleteStation(stationId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.deleteStationLoading.set(false);
          this.notificationService.success('Station gelöscht.');

          this.router.navigate(['/stations']);
        },
        error: () => {
          this.deleteStationLoading.set(false);
          this.notificationService.error(
            'Station konnte nicht gelöscht werden.'
          );
        },
      });
  }
}
