import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Order, Station } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  InputDirective,
  MembersInputComponent,
} from '../../components';
import {
  AuthService,
  NotificationService,
  StationService,
} from '../../services';

@Component({
  selector: 'bkr-station-edit',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    InputDirective,
    MembersInputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationEditComponent {
  @HostBinding('class.page') page = true;

  readonly Order = Order;

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

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });

  saveLoading = signal(false);

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(6), Validators.maxLength(6)],
    }),
    order: new FormControl<Order>(Order.DESC, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    members: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stationService: StationService
  ) {
    effect(() => {
      const station = this.station();

      if (!station) {
        return;
      }

      this.form.patchValue({
        name: station.name,
        number: station.number,
        code: station.code,
        order: station.order,
        members: station.members ?? [],
      });
    });
  }

  handleSave(stationId: string): void {
    const { name, number, code, order, members } = this.form.value;

    if (
      this.form.invalid ||
      typeof name === 'undefined' ||
      typeof number === 'undefined' ||
      typeof code === 'undefined' ||
      typeof order === 'undefined' ||
      number === null
    ) {
      return;
    }

    const nonEmptyMembers =
      members?.filter((member) => member.length > 0) ?? [];

    this.saveLoading.set(true);

    this.stationService
      .updateStation(stationId, {
        name,
        number,
        code,
        order,
        members: nonEmptyMembers,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saveLoading.set(false);
          this.notificationService.success('Station wurde aktualisiert.');

          this.router.navigate(['/stations', stationId]);
        },
        error: (err: HttpErrorResponse) => {
          this.saveLoading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Station mit dieser Nummer.'
            );
          } else if (error === '"code" must be unique') {
            this.notificationService.error(
              'Es gibt bereits eine Station mit diesem Code.'
            );
          } else {
            this.notificationService.error(
              'Station konnte nicht aktualisiert werden.'
            );
          }
        },
      });
  }
}
