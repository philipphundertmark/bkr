import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  handleSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.form.value);
  }
}
