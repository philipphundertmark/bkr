import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  ConfirmComponent,
  ConfirmData,
  ConfirmType,
} from '../components/confirm/confirm.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private readonly dialog: Dialog) {}

  info(config: Omit<ConfirmData, 'type'>): Observable<boolean> {
    return this.open(ConfirmType.INFO, config);
  }

  delete(config: Omit<ConfirmData, 'type'>): Observable<boolean> {
    return this.open(ConfirmType.DELETE, {
      confirmText: 'Löschen',
      ...config,
    });
  }

  private open(
    type: ConfirmType,
    config: Omit<ConfirmData, 'type'>,
  ): Observable<boolean> {
    const dialogRef = this.dialog.open<boolean, ConfirmData, ConfirmComponent>(
      ConfirmComponent,
      {
        data: {
          type,
          ...config,
        },
        backdropClass: 'backdrop',
        panelClass: 'dialog',
      },
    );

    return dialogRef.closed.pipe(map((confirmed) => confirmed ?? false));
  }
}
