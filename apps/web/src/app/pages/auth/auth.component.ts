import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bkr-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {}
