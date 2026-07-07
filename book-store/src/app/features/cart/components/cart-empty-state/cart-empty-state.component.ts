import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center text-center py-5">
      <span class="material-icons text-muted mb-3" style="font-size:80px">shopping_cart</span>
      <h2 class="h5 fw-bold mb-2" style="color:var(--text-heading)">Your cart is empty</h2>
      <p class="text-muted mb-4">Looks like you haven't added anything yet.</p>
      <a
        routerLink="/catalog"
        class="btn btn-primary px-5"
        style="background:var(--brand-accent);border-color:var(--brand-accent)"
      >Start Shopping</a>
    </div>
  `,
})
export class CartEmptyStateComponent {}
