import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

/**
 * Fixed-position toast notification container.
 * Reads the `ToastService.toasts()` signal and renders each toast.
 * Placed once in the Layout shell component.
 */
@Component({
  selector: 'app-toast-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <div
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index:1100"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast show align-items-center border-0 mb-2"
          [ngClass]="toastClass(toast)"
          role="alert"
        >
          <div class="d-flex">
            <div class="toast-body fw-semibold">
              <span class="material-icons align-middle me-2" style="font-size:18px">{{ toastIcon(toast) }}</span>
              {{ toast.message }}
            </div>
            <button
              type="button"
              class="btn-close me-2 m-auto"
              [attr.aria-label]="'Close notification'"
              (click)="toastService.dismiss(toast.id)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastNotificationComponent {
  readonly toastService = inject(ToastService);

  dismissed = output<number>();

  toastClass(toast: Toast): Record<string, boolean> {
    return {
      'text-bg-success': toast.type === 'success',
      'text-bg-danger':  toast.type === 'error',
      'text-bg-warning': toast.type === 'warning',
      'text-bg-info':    toast.type === 'info',
    };
  }

  toastIcon(toast: Toast): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error:   'error',
      warning: 'warning',
      info:    'info',
    };
    return icons[toast.type] ?? 'info';
  }
}
