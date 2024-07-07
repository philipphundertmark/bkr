import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

import { Order, StationUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  DangerZoneComponent,
  EmptyComponent,
} from '../../components';
import {
  ArrowDownCircleIconComponent,
  ArrowUpCircleIconComponent,
  TrashIconComponent,
} from '../../icons/mini';
import {
  AuthService,
  NotificationService,
  StationService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [
    ArrowDownCircleIconComponent,
    ArrowUpCircleIconComponent,
    ButtonComponent,
    CommonModule,
    DangerZoneComponent,
    EmptyComponent,
    RouterModule,
    TrashIconComponent,
  ],
  host: { class: 'page' },
  styleUrl: './station-details.component.scss',
  templateUrl: './station-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationDetailsComponent implements OnInit {
  readonly Order = Order;
  readonly StationUtils = StationUtils;

  /** Route parameter */
  stationId = input.required<string>();

  stations = this.store.stations;

  station = computed(
    () => this.stations().find(({ id }) => id === this.stationId()) ?? null,
  );
  station$ = toObservable(this.station);

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  deleteStationLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly stationService: StationService,
    private readonly store: Store,
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.station$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((station) => {
        if (!station) {
          this.router.navigate(['/stations']);
          return;
        }
      });
  }

  handleDeleteStation(stationId: string): void {
    this.confirmService
      .delete({
        title: 'Station löschen',
        message: 'Möchtest du das Station wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteStationLoading.set(true);

          return this.stationService.deleteStation(stationId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.deleteStationLoading.set(false);
          this.store.deleteStation(stationId);
          this.notificationService.success('Station gelöscht.');

          this.router.navigate(['/stations']);
        },
        error: () => {
          this.deleteStationLoading.set(false);
          this.notificationService.error(
            'Station konnte nicht gelöscht werden.',
          );
        },
      });
  }
}
