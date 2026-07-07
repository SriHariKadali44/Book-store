import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BookSummary } from '../../models/book.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { BadgeComponent } from '../badge/badge.component';

/**
 * Reusable book card used in listings, grids, and carousels.
 *
 * Outputs:
 *  - `addToCart`      — emits the book when the "Add to Cart" button is clicked
 *  - `wishlistToggle` — emits { book, wishlisted } when the heart icon is toggled
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink, StarRatingComponent, PriceDisplayComponent, BadgeComponent],
  template: `
    <div class="card h-100 shadow-sm border-0 position-relative" style="border-radius:10px;overflow:hidden">
      <!-- Badges: New / Bestseller -->
      <div class="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1" style="z-index:1">
        @if (book().isNew) {
          <app-badge label="New" variant="new" />
        }
        @if (book().isBestseller) {
          <app-badge label="Bestseller" variant="sale" />
        }
      </div>

      <!-- Wishlist toggle -->
      @if (showWishlist()) {
        <button
          type="button"
          class="btn p-1 border-0 bg-transparent position-absolute top-0 end-0 m-2"
          style="z-index:1"
          [attr.aria-label]="wishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
          (click)="toggleWishlist()"
        >
          <span class="material-icons" [style.color]="wishlisted() ? 'var(--brand-accent)' : '#ccc'">
            {{ wishlisted() ? 'favorite' : 'favorite_border' }}
          </span>
        </button>
      }

      <!-- Cover image -->
      <a [routerLink]="['/catalog', book().id]" class="d-block bg-surface-muted" style="height:200px;overflow:hidden">
        @if (book().coverUrl) {
          <img
            [ngSrc]="book().coverUrl"
            [alt]="book().title + ' cover'"
            width="200"
            height="200"
            style="width:100%;height:100%;object-fit:cover"
          />
        } @else {
          <div class="w-100 h-100 d-flex align-items-center justify-content-center bg-surface-muted">
            <span class="material-icons text-muted" style="font-size:64px">menu_book</span>
          </div>
        }
      </a>

      <!-- Card body -->
      <div class="card-body d-flex flex-column gap-1 p-3">
        <app-badge [label]="book().format" variant="format" />

        <a
          [routerLink]="['/catalog', book().id]"
          class="fw-semibold text-decoration-none stretched-link"
          style="color:var(--text-heading);font-family:var(--font-heading);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden"
        >{{ book().title }}</a>

        <p class="text-muted small mb-0">{{ book().author }}</p>

        <app-star-rating [value]="book().rating" size="sm" />
        <span class="text-muted" style="font-size:11px">({{ book().reviewCount }})</span>

        <div class="mt-auto pt-2">
          <app-price-display
            [price]="book().price"
            [discountPrice]="book().discountPrice"
          />
        </div>
      </div>

      <!-- Add to Cart footer -->
      <div class="card-footer border-0 bg-transparent px-3 pb-3 pt-0">
        <button
          type="button"
          class="btn btn-accent w-100"
          [attr.aria-label]="'Add ' + book().title + ' to cart'"
          (click)="onAddToCart($event)"
        >
          <span class="material-icons align-middle me-1" style="font-size:16px">shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; transform: translateY(-2px); }
    .stretched-link::after { z-index: 0; }
    button { position: relative; z-index: 1; }
  `],
})
export class BookCardComponent {
  book         = input.required<BookSummary>();
  showWishlist = input<boolean>(true);
  initialWishlisted = input<boolean>(false);

  addToCart      = output<BookSummary>();
  wishlistToggle = output<{ book: BookSummary; wishlisted: boolean }>();

  readonly wishlisted = signal(false);

  constructor() {
    // sync initial wishlist state — can't use effect here without inject context issues
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.book());
  }

  toggleWishlist(): void {
    const next = !this.wishlisted();
    this.wishlisted.set(next);
    this.wishlistToggle.emit({ book: this.book(), wishlisted: next });
  }
}
