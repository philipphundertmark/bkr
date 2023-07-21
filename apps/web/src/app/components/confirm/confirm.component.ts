import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
} from '@angular/core';

import {
  ExclamationCircleIconComponent,
  InformationCircleIconComponent,
} from '../../icons/mini';
import { ButtonComponent, ButtonType } from '../button/button.component';

export interface ConfirmData {
  title: string;
  message: string;
  type: ConfirmType;
  cancelText?: string;
  confirmText?: string;
}

export enum ConfirmType {
  INFO,
  DELETE,
}

@Component({
  selector: 'bkr-confirm',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ExclamationCircleIconComponent,
    InformationCircleIconComponent,
  ],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {
  @HostBinding('attr.role') role = 'dialog';

  readonly ConfirmType = ConfirmType;

  get buttonType(): ButtonType {
    switch (this.data.type) {
      case ConfirmType.INFO:
        return 'primary';
      case ConfirmType.DELETE:
        return 'danger';
    }
  }

  get cancelText(): string {
    return this.data.cancelText ?? 'Abbrechen';
  }

  get confirmText(): string {
    return this.data.confirmText ?? 'Bestätigen';
  }

  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: ConfirmData
  ) {}

  handleConfirm(): void {
    this.dialogRef.close(true);
  }

  handleCancel(): void {
    this.dialogRef.close(false);
  }
}
