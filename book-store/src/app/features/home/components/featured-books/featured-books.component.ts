import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BookSummary } from '../../../../shared/models/book.model';
import { BookCardComponent } from '../../../../shared/ui/book-card/book-card.component';

@Component({
  selector: 'app-featured-books',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent],
  template: `
    <section class="py-5" aria-labelledby="featured-heading">
      <div class="container-xl px-3 px-lg-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2
            id="featured-heading"
            class="font-heading fw-bold mb-0"
            style="color:var(--text-heading);font-size:clamp(1.5rem,3vw,2rem)"
          >Staff Picks</h2>
          <a href="/catalog" class="btn btn-sm btn-outline-primary">View All</a>
        </div>

        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4">
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
      </div>
    </section>
  `,
})
export class FeaturedBooksComponent {
  books = input.required<BookSummary[]>();
  addToCart      = output<BookSummary>();
  wishlistToggle = output<{ book: BookSummary; wishlisted: boolean }>();
}
