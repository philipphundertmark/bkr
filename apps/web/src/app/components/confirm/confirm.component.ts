import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Inject } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

export interface ConfirmData {
  title: string;
  message: string;
  type: ConfirmType;
}

export enum ConfirmType {
  INFO,
  DELETE,
}

@Component({
  selector: 'bkr-confirm',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  @HostBinding('attr.role') role = 'dialog';

  readonly ConfirmType = ConfirmType;

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
