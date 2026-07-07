import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number; // ms
}

/**
 * Global toast/snackbar service.
 * Components subscribe to `toasts()` signal to render notifications.
 * The errorInterceptor uses `show()` to surface HTTP errors.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private _nextId = 0;
  private readonly _toasts = signal<Toast[]>([]);

  /** Read-only signal consumed by ToastNotificationComponent. */
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = ++this._nextId;
    this._toasts.update(ts => [...ts, { id, message, type, duration }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this._toasts.update(ts => ts.filter(t => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}
