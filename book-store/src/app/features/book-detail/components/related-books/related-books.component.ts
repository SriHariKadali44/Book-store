import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BookSummary } from '../../../../shared/models/book.model';
import { BookCardComponent } from '../../../../shared/ui/book-card/book-card.component';

@Component({
  selector: 'app-related-books',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent],
  template: `
    @if (books().length > 0) {
      <section class="py-5 bg-surface-muted" aria-labelledby="related-heading">
        <div class="container-xl px-3 px-lg-4">
          <h2 id="related-heading" class="h5 fw-bold mb-4" style="color:var(--text-heading)">You May Also Like</h2>
          <div
            class="d-flex gap-3 overflow-auto pb-2"
            style="scroll-snap-type:x mandatory"
          >
            @for (book of books(); track book.id) {
              <div style="min-width:200px;max-width:220px;scroll-snap-align:start" class="flex-shrink-0">
                <app-book-card
                  [book]="book"
                  [showWishlist]="true"
                  (addToCart)="addToCart.emit($event)"
                />
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class RelatedBooksComponent {
  books      = input.required<BookSummary[]>();
  addToCart  = output<BookSummary>();
}
