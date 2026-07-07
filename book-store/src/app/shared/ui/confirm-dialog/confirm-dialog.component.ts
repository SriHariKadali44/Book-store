import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  OnInit,
  HostListener,
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

/**
 * Reusable confirmation dialog opened via Angular CDK Overlay.
 * Traps focus and closes on Escape key.
 *
 * Usage: instantiate via ConfirmDialogService (see service file).
 * When used as a standalone overlay the host must pass the overlayRef input.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="modal-dialog modal-dialog-centered"
      role="dialog"
      [attr.aria-labelledby]="'confirm-dialog-title'"
      [attr.aria-describedby]="'confirm-dialog-body'"
      tabindex="-1"
    >
      <div class="modal-content shadow-lg border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold" id="confirm-dialog-title">{{ title() }}</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            (click)="onCancel()"
          ></button>
        </div>
        <div class="modal-body" id="confirm-dialog-body">
          <p class="text-muted mb-0">{{ message() }}</p>
        </div>
        <div class="modal-footer border-0 pt-0 gap-2">
          <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
            {{ cancelLabel() }}
          </button>
          <button
            type="button"
            [class]="destructive() ? 'btn btn-danger' : 'btn btn-primary'"
            (click)="onConfirm()"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class ConfirmDialogComponent implements OnInit {
  title        = input<string>('Are you sure?');
  message      = input<string>('This action cannot be undone.');
  confirmLabel = input<string>('Confirm');
  cancelLabel  = input<string>('Cancel');
  destructive  = input<boolean>(false);
  overlayRef   = input<OverlayRef | null>(null);

  confirmed = output<void>();
  cancelled = output<void>();

  /** Tracks whether the dialog is open — used by host to conditionally show. */
  readonly isOpen = signal(true);

  ngOnInit(): void {
    this.isOpen.set(true);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.onCancel();
  }

  onConfirm(): void {
    this.confirmed.emit();
    this._close();
  }

  onCancel(): void {
    this.cancelled.emit();
    this._close();
  }

  private _close(): void {
    this.isOpen.set(false);
    this.overlayRef()?.dispose();
  }
}
