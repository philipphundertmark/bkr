import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Order } from '@bkr/api-interface';

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
import { Store } from '../../services/store';

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
  host: { class: 'page' },
  styleUrl: './station-edit.component.scss',
  templateUrl: './station-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationEditComponent implements OnInit {
  readonly Order = Order;

  /** Route parameter */
  stationId = input.required<string>();

  stations = this.store.stations;

  station = computed(
    () => this.stations().find(({ id }) => id === this.stationId()) ?? null,
  );
  station$ = toObservable(this.station);

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

  formStatus = toSignal(this.form.statusChanges, { initialValue: 'INVALID' });
  formInvalid = computed(() => this.formStatus() === 'INVALID');

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
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
      members
        ?.map((member) => member.trim())
        .filter((member) => member.length > 0) ?? [];

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
        next: (station) => {
          this.saveLoading.set(false);
          this.store.updateStation(station);
          this.notificationService.success('Station wurde aktualisiert.');

          this.router.navigate(['/stations', stationId]);
        },
        error: (err: HttpErrorResponse) => {
          this.saveLoading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Station mit dieser Nummer.',
            );
          } else if (error === '"code" must be unique') {
            this.notificationService.error(
              'Es gibt bereits eine Station mit diesem Code.',
            );
          } else {
            this.notificationService.error(
              'Station konnte nicht aktualisiert werden.',
            );
          }
        },
      });
  }
}
