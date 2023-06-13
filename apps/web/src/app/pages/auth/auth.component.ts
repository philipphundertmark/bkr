import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent, InputDirective } from '../../components';
import { AuthService, NotificationService } from '../../services';

@Component({
  selector: 'bkr-auth',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputDirective, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Input() returnUrl = '/';

  form = new FormGroup({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  loading = false;

  isAuthenticated = toSignal(this.authService.isAuthenticated$);
  isAdmin = toSignal(this.authService.isAdmin$);
  isStation = toSignal(this.authService.isStation$);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  handleLogout(): void {
    this.authService.logout();
    this.notificationService.success('Du bist jetzt ausgeloggt.');

    this.router.navigateByUrl('/');
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    const { code } = this.form.value;

    if (this.form.invalid || !code) {
      return this.form.reset();
    }

    this.loading = true;

    this.authService
      .login(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.form.reset();
          this.notificationService.success('Du bist jetzt eingeloggt.');

          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
          this.loading = false;
          this.form.reset();
          this.notificationService.error('Das hat leider nicht geklappt.');
        },
      });
  }
}
