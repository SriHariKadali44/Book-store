import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BookSummary } from '../../../../shared/models/book.model';
import { BookCardComponent } from '../../../../shared/ui/book-card/book-card.component';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent],
  template: `
    <section class="py-5" style="background:var(--surface-muted)" aria-labelledby="new-arrivals-heading">
      <div class="container-xl px-3 px-lg-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2
            id="new-arrivals-heading"
            class="font-heading fw-bold mb-0"
            style="color:var(--text-heading);font-size:clamp(1.5rem,3vw,2rem)"
          >New Arrivals</h2>
          <a href="/catalog?sortBy=newest" class="btn btn-sm btn-outline-primary">See All New</a>
        </div>

        <!-- Horizontal scroll on mobile, normal grid on desktop -->
        <div
          class="d-flex gap-3 overflow-auto pb-2 d-lg-grid"
          style="scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch"
        >
          @for (book of books(); track book.id) {
            <div style="min-width:200px;max-width:240px;scroll-snap-align:start" class="flex-shrink-0 col-lg">
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
  styles: [`.d-lg-grid { display: flex; } @media (min-width:992px) { .d-lg-grid { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); } }`],
})
export class NewArrivalsComponent {
  books = input.required<BookSummary[]>();
  addToCart      = output<BookSummary>();
  wishlistToggle = output<{ book: BookSummary; wishlisted: boolean }>();
}
