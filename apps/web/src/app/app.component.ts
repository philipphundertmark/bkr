import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { UserIconComponent } from './icons/solid';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [RouterModule, UserIconComponent],
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

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
