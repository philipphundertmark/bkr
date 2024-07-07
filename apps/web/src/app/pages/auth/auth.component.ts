import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  computed,
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
import { Router } from '@angular/router';

import { ButtonComponent, InputDirective } from '../../components';
import { DatePipe } from '../../pipes';
import { AuthService, NotificationService } from '../../services';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-auth',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    DatePipe,
    InputDirective,
    ReactiveFormsModule,
  ],
  host: { class: 'page' },
  styleUrl: './auth.component.scss',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  @Input() returnUrl = '/';

  form = new FormGroup({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  loginLoading = signal(false);

  exp = toSignal(this.authService.exp$, { initialValue: null });
  sub = toSignal(this.authService.sub$, { initialValue: null });

  isAuthenticated = toSignal(this.authService.isAuthenticated$, {
    initialValue: false,
  });
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  isStation = toSignal(this.authService.isStation$, { initialValue: false });

  stations = this.store.stations;
  station = computed(
    () => this.stations().find((station) => station.id === this.sub()) ?? null,
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  handleLogin(): void {
    const { code } = this.form.value;

    if (this.form.invalid || !code) {
      return;
    }

    this.loginLoading.set(true);

    this.authService
      .login(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loginLoading.set(false);
          this.form.reset();
          this.notificationService.success('Du bist jetzt eingeloggt.');

          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
          this.loginLoading.set(false);
          this.form.reset();
          this.notificationService.error('Das hat leider nicht geklappt.');
        },
      });
  }

  handleLogout(): void {
    this.authService.logout();
    this.notificationService.success('Du bist jetzt ausgeloggt.');

    this.router.navigateByUrl('/');
  }
}
