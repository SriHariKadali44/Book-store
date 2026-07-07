import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BookSummary } from '../../../../shared/models/book.model';
import { BookCardComponent } from '../../../../shared/ui/book-card/book-card.component';
import { LoadingSkeletonComponent } from '../../../../shared/ui/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent, LoadingSkeletonComponent, EmptyStateComponent],
  template: `
    @if (loading()) {
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4">
        @for (i of skeletons; track i) {
          <div class="col">
            <app-loading-skeleton type="card" [rows]="1" />
          </div>
        }
      </div>
    } @else if (books().length === 0) {
      <app-empty-state
        icon="search_off"
        title="No books found"
        description="Try adjusting your filters or search term."
        ctaLabel="Clear Filters"
        (ctaClick)="clearFilters.emit()"
      />
    } @else {
      <div
        class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4"
        aria-label="Book listing"
      >
        @for (book of books(); track book.id) {
          <div class="col">
            <app-book-card
              [book]="book"
              [showWishlist]="true"
              (addToCart)="addToCart.emit($event)"
              (wishlistToggle)="wishlistToggle.emit($event)"
            />
          </div>
        }
      </div>
    }
  `,
})
export class BookGridComponent {
  books   = input.required<BookSummary[]>();
  loading = input<boolean>(false);

  addToCart      = output<BookSummary>();
  wishlistToggle = output<{ book: BookSummary; wishlisted: boolean }>();
  clearFilters   = output<void>();

  readonly skeletons = Array.from({ length: 8 }, (_, i) => i);
}
