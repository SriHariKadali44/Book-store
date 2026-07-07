import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Category } from '../../../../shared/models/category.model';
import { CatalogFilters } from '../../../../shared/models/catalog-filter.model';
import { BookFormat } from '../../../../shared/models/book.model';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <aside aria-label="Catalog filters" class="bg-surface-card border rounded-3 p-3">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h6 fw-bold mb-0" style="color:var(--text-heading)">
          <span class="material-icons align-middle me-1" style="font-size:18px">tune</span>
          Filters
        </h2>
        <button type="button" class="btn btn-sm btn-link text-muted p-0" (click)="clearAll.emit()">
          Clear All
        </button>
      </div>

      <!-- Category -->
      <div class="mb-4">
        <h3 class="small fw-bold text-uppercase mb-2" style="color:var(--text-muted);letter-spacing:0.05em">Category</h3>
        @for (cat of categories(); track cat.id) {
          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="checkbox"
              [id]="'cat-' + cat.id"
              [checked]="filters().categoryId === cat.id"
              (change)="onCategoryChange(cat.id)"
            />
            <label class="form-check-label small d-flex justify-content-between" [for]="'cat-' + cat.id">
              {{ cat.name }}
              <span class="text-muted">({{ cat.bookCount }})</span>
            </label>
          </div>
        }
      </div>

      <!-- Price Range -->
      <div class="mb-4">
        <h3 class="small fw-bold text-uppercase mb-2" style="color:var(--text-muted);letter-spacing:0.05em">Price Range</h3>
        <div class="d-flex align-items-center gap-2">
          <div class="input-group input-group-sm">
            <span class="input-group-text">$</span>
            <input
              type="number"
              class="form-control"
              placeholder="Min"
              [value]="filters().priceMin ?? ''"
              (change)="onPriceChange('min', $event)"
              min="0"
              aria-label="Minimum price"
            />
          </div>
          <span class="text-muted small">–</span>
          <div class="input-group input-group-sm">
            <span class="input-group-text">$</span>
            <input
              type="number"
              class="form-control"
              placeholder="Max"
              [value]="filters().priceMax ?? ''"
              (change)="onPriceChange('max', $event)"
              min="0"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="mb-4">
        <h3 class="small fw-bold text-uppercase mb-2" style="color:var(--text-muted);letter-spacing:0.05em">Rating</h3>
        @for (r of ratingOptions; track r) {
          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="radio"
              name="rating"
              [id]="'rating-' + r"
              [checked]="filters().rating === r"
              (change)="onRatingChange(r)"
            />
            <label class="form-check-label small" [for]="'rating-' + r">
              {{ r }}+ stars
            </label>
          </div>
        }
      </div>

      <!-- Format -->
      <div class="mb-2">
        <h3 class="small fw-bold text-uppercase mb-2" style="color:var(--text-muted);letter-spacing:0.05em">Format</h3>
        @for (fmt of formats; track fmt) {
          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="checkbox"
              [id]="'fmt-' + fmt"
              [checked]="isFormatChecked(fmt)"
              (change)="onFormatChange(fmt)"
            />
            <label class="form-check-label small text-capitalize" [for]="'fmt-' + fmt">{{ fmt }}</label>
          </div>
        }
      </div>
    </aside>
  `,
})
export class CatalogFiltersComponent {
  filters    = input.required<CatalogFilters>();
  categories = input.required<Category[]>();

  filtersChange = output<Partial<CatalogFilters>>();
  clearAll      = output<void>();

  readonly ratingOptions = [4, 3, 2, 1];
  readonly formats: BookFormat[] = ['paperback', 'hardcover', 'ebook', 'audiobook'];

  onCategoryChange(id: string): void {
    const newCat = this.filters().categoryId === id ? undefined : id;
    this.filtersChange.emit({ categoryId: newCat });
  }

  onPriceChange(type: 'min' | 'max', event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (type === 'min') this.filtersChange.emit({ priceMin: isNaN(val) ? undefined : val });
    else this.filtersChange.emit({ priceMax: isNaN(val) ? undefined : val });
  }

  onRatingChange(r: number): void {
    const newRating = this.filters().rating === r ? undefined : r;
    this.filtersChange.emit({ rating: newRating });
  }

  onFormatChange(fmt: BookFormat): void {
    const cur = this.filters().format ?? [];
    const next = cur.includes(fmt) ? cur.filter(f => f !== fmt) : [...cur, fmt];
    this.filtersChange.emit({ format: next.length ? next : undefined });
  }

  isFormatChecked(fmt: BookFormat): boolean {
    return (this.filters().format ?? []).includes(fmt);
  }
}
