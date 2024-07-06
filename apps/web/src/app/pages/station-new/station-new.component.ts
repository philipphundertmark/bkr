import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  HostBinding,
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

import { Order } from '@bkr/api-interface';

import {
  ButtonComponent,
  InputDirective,
  MembersInputComponent,
} from '../../components';
import { NotificationService, StationService } from '../../services';

@Component({
  selector: 'bkr-station-new',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputDirective,
    MembersInputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './station-new.component.html',
  styleUrls: ['./station-new.component.scss'],
})
export class StationNewComponent {
  @HostBinding('class.page') page = true;

  readonly Order = Order;

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

  loading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly stationService: StationService,
  ) {}

  handleSave(): void {
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

    this.loading.set(true);

    this.stationService
      .createStation({
        name,
        number,
        code,
        order,
        members: nonEmptyMembers,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          window.plausible('Create Station');

          this.loading.set(false);
          this.notificationService.success('Station wurde erstellt.');

          this.router.navigate(['/stations']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits eine Station mit dieser Nummer.',
            );
          } else if (error === '"code" must be unique') {
            this.notificationService.error(
              'Es gibt bereits eine Station mit diesem Code.',
            );
          } else {
            this.notificationService.error(
              'Station konnte nicht erstellt werden.',
            );
          }
        },
      });
  }
}
