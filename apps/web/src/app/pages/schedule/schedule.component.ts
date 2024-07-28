import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { EMPTY, switchMap } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  InputDirective,
} from '../../components';
import {
  ConfirmService,
  NotificationService,
  TeamService,
} from '../../services';
import { Store } from '../../services/store';
import { dateTimeValidator } from '../../validators';

@Component({
  selector: 'bkr-schedule',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CommonModule,
    InputDirective,
    ReactiveFormsModule,
    RouterModule,
  ],
  host: { class: 'page' },
  styleUrl: './schedule.component.scss',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  scheduleLoading = signal(false);

  form = new FormGroup({
    start: new FormControl<string>(
      // By default, set the start to the next full hour
      dayjs().startOf('hour').add(1, 'hour').format('DD.MM.YYYY HH:mm:ss'),
      {
        nonNullable: true,
        validators: [Validators.required, dateTimeValidator()],
      },
    ),
    interval: new FormControl<number>(
      // By default, set the interval to 4 minutes
      4,
      {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      },
    ),
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  handleSave(): void {
    const { interval, start } = this.form.value;

    if (typeof interval === 'undefined' || typeof start === 'undefined') {
      return;
    }

    this.confirmService
      .info({
        title: 'Rennstart festlegen',
        message:
          'Möchtest du den Start des Rennens wirklich festlegen? Dadurch werden aktuelle Zeiten überschrieben und die Reihenfolge aller Teams neu gemischt.',
      })

      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.form.disable();
          this.scheduleLoading.set(true);

          return this.teamService.scheduleTeams({
            start: dayjs(start, 'DD.MM.YYYY HH:mm:ss').toISOString(),
            interval,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (teams) => {
          this.form.enable();
          this.scheduleLoading.set(false);

          this.store.setTeams(teams);
          this.notificationService.success('Reihenfolge wurde ausgelost.');

          this.router.navigate(['/']);
        },
        error: () => {
          this.form.enable();
          this.scheduleLoading.set(false);

          this.notificationService.error(
            'Reihenfolge konnte nicht ausgelost werden.',
          );
        },
      });
  }
}
