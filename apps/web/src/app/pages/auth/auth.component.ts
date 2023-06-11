import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent, InputDirective } from '../../components';

@Component({
  selector: 'bkr-auth',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputDirective, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  form = new FormGroup({
    code: new FormControl<string>(''),
  });
}
