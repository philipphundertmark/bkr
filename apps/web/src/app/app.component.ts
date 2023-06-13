import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import {
  FlagIconComponent,
  StarIconComponent,
  UserIconComponent,
} from './icons/mini';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.authService.restore();
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
