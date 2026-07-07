import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CatalogFilters, CatalogSortBy } from '../../../../shared/models/catalog-filter.model';

@Component({
  selector: 'app-catalog-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <!-- Result count -->
      <p class="mb-0 text-muted small" aria-live="polite">
        <span class="fw-semibold" style="color:var(--text-heading)">{{ totalItems() }}</span>
        books found
      </p>

      <div class="d-flex align-items-center gap-2">
        <!-- Sort -->
        <label class="small text-muted mb-0" for="sort-select">Sort:</label>
        <select
          id="sort-select"
          class="form-select form-select-sm"
          style="width:auto"
          [value]="filters().sortBy"
          (change)="onSortChange($event)"
          aria-label="Sort books"
        >
          @for (opt of sortOptions; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>

        <!-- Page size -->
        <label class="small text-muted mb-0" for="page-size-select">Show:</label>
        <select
          id="page-size-select"
          class="form-select form-select-sm"
          style="width:auto"
          [value]="filters().pageSize"
          (change)="onPageSizeChange($event)"
          aria-label="Items per page"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>
    </div>
  `,
})
export class CatalogToolbarComponent {
  filters    = input.required<CatalogFilters>();
  totalItems = input.required<number>();

  filtersChange = output<Partial<CatalogFilters>>();

  readonly sortOptions: { value: CatalogSortBy; label: string }[] = [
    { value: 'relevance', label: 'Relevance'    },
    { value: 'price_asc', label: 'Price: Low–High' },
    { value: 'price_desc',label: 'Price: High–Low' },
    { value: 'rating',    label: 'Top Rated'    },
    { value: 'newest',    label: 'Newest First' },
  ];

  onSortChange(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value as CatalogSortBy;
    this.filtersChange.emit({ sortBy, page: 1 });
  }

  onPageSizeChange(event: Event): void {
    const pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.filtersChange.emit({ pageSize, page: 1 });
  }
}
