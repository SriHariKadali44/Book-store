import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { BookSummary, BookFormat } from '../../../../shared/models/book.model';
import { CartService } from '../../../cart/services/cart.service';
import { inject } from '@angular/core';
import { PriceDisplayComponent } from '../../../../shared/ui/price-display/price-display.component';
import { StarRatingComponent } from '../../../../shared/ui/star-rating/star-rating.component';
import { QuantityStepperComponent } from '../../../../shared/ui/quantity-stepper/quantity-stepper.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-book-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PriceDisplayComponent, StarRatingComponent, QuantityStepperComponent, BadgeComponent],
  template: `
    <div class="d-flex flex-column gap-3">
      <!-- Format badge + badges -->
      <div class="d-flex gap-2 flex-wrap">
        <app-badge [label]="book().format" variant="format" />
        @if (book().isNew) { <app-badge label="New" variant="new" /> }
        @if (book().isBestseller) { <app-badge label="Bestseller" variant="sale" /> }
      </div>

      <!-- Title + author -->
      <div>
        <h1 class="font-heading fw-bold mb-1" style="font-size:clamp(1.5rem,3vw,2rem);color:var(--text-heading)">
          {{ book().title }}
        </h1>
        <p class="text-muted mb-0 fs-6">by <strong>{{ book().author }}</strong></p>
      </div>

      <!-- Rating -->
      <div class="d-flex align-items-center gap-2">
        <app-star-rating [value]="book().rating" size="md" />
        <span class="small text-muted">{{ book().rating }} ({{ book().reviewCount }} reviews)</span>
      </div>

      <!-- Price -->
      <app-price-display
        [price]="book().price"
        [discountPrice]="book().discountPrice"
      />

      <!-- Quantity -->
      <div class="d-flex align-items-center gap-3">
        <span class="small text-muted">Quantity:</span>
        <app-quantity-stepper
          [value]="qty()"
          [min]="1"
          [max]="99"
          (valueChange)="qty.set($event)"
        />
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 flex-wrap">
        <button
          type="button"
          class="btn btn-primary btn-lg px-4 flex-grow-1"
          style="background:var(--brand-accent);border-color:var(--brand-accent)"
          [disabled]="adding()"
          (click)="onAddToCart()"
        >
          <span class="material-icons align-middle me-2" style="font-size:18px">shopping_cart</span>
          {{ adding() ? 'Adding…' : 'Add to Cart' }}
        </button>
        <button
          type="button"
          class="btn btn-lg btn-outline-secondary px-3"
          aria-label="Add to wishlist"
          (click)="wishlistToggle.emit(book())"
        >
          <span class="material-icons">favorite_border</span>
        </button>
      </div>
    </div>
  `,
})
export class BookInfoComponent {
  book = input.required<BookSummary>();

  addToCartEvent = output<{ book: BookSummary; qty: number }>();
  wishlistToggle = output<BookSummary>();

  readonly qty    = signal(1);
  readonly adding = signal(false);

  onAddToCart(): void {
    this.adding.set(true);
    this.addToCartEvent.emit({ book: this.book(), qty: this.qty() });
    setTimeout(() => this.adding.set(false), 800);
  }
}
