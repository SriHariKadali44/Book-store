import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { PaginationMeta } from '../../models/pagination.model';

/**
 * Keyboard-navigable pagination control.
 * Emits `pageChange` with the new page number (1-based).
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (meta().totalPages > 1) {
      <nav aria-label="Pagination">
        <ul class="pagination justify-content-center mb-0">
          <!-- Previous -->
          <li class="page-item" [class.disabled]="meta().page <= 1">
            <button
              type="button"
              class="page-link"
              [attr.aria-label]="'Previous page'"
              [disabled]="meta().page <= 1"
              (click)="onPage(meta().page - 1)"
            >
              <span class="material-icons" style="font-size:18px;vertical-align:middle">chevron_left</span>
            </button>
          </li>

          <!-- Page numbers -->
          @for (p of pages(); track p) {
            @if (p === -1) {
              <li class="page-item disabled">
                <span class="page-link">…</span>
              </li>
            } @else {
              <li class="page-item" [class.active]="p === meta().page">
                <button
                  type="button"
                  class="page-link"
                  [attr.aria-label]="'Page ' + p"
                  [attr.aria-current]="p === meta().page ? 'page' : null"
                  (click)="onPage(p)"
                >{{ p }}</button>
              </li>
            }
          }

          <!-- Next -->
          <li class="page-item" [class.disabled]="meta().page >= meta().totalPages">
            <button
              type="button"
              class="page-link"
              [attr.aria-label]="'Next page'"
              [disabled]="meta().page >= meta().totalPages"
              (click)="onPage(meta().page + 1)"
            >
              <span class="material-icons" style="font-size:18px;vertical-align:middle">chevron_right</span>
            </button>
          </li>
        </ul>
      </nav>
    }
  `,
})
export class PaginationComponent {
  meta = input.required<PaginationMeta>();
  pageChange = output<number>();

  /**
   * Computes the visible page numbers with ellipsis (-1) placeholders.
   * Always shows first, last, current ±2, and inserts -1 for gaps.
   */
  readonly pages = computed(() => {
    const { page, totalPages } = this.meta();
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result: number[] = [1];
    if (page > 3) result.push(-1);

    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      result.push(p);
    }

    if (page < totalPages - 2) result.push(-1);
    result.push(totalPages);

    return result;
  });

  onPage(page: number): void {
    const { page: current, totalPages } = this.meta();
    if (page < 1 || page > totalPages || page === current) return;
    this.pageChange.emit(page);
  }
}
