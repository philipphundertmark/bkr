import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

import { Station, StationUtils } from '@bkr/api-interface';

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
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationDetailsComponent {
  @HostBinding('class.page') page = true;

  readonly StationUtils = StationUtils;

  paramMap = toSignal(this.route.paramMap, {
    initialValue: null,
  });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });

  stationId = computed(() => this.paramMap()?.get('stationId') ?? null);
  station = computed(() => {
    const stationId = this.stationId();

    if (!stationId) {
      return null;
    }

    return this.stations().find(({ id }) => id === stationId) ?? null;
  });

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  deleteStationLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stationService: StationService
  ) {}

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
