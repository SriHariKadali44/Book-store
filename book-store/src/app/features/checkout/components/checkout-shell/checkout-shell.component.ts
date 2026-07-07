import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../../cart/services/cart.service';
import { CheckoutStepperComponent } from '../checkout-stepper/checkout-stepper.component';
import { CheckoutOrderSummaryComponent } from '../checkout-order-summary/checkout-order-summary.component';

@Component({
  selector: 'app-checkout-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CheckoutStepperComponent, CheckoutOrderSummaryComponent],
  template: `
    <div class="container-xl px-3 px-lg-4 py-4">
      <h1 class="font-heading fw-bold mb-4" style="font-size:1.75rem;color:var(--text-heading)">Checkout</h1>

      <app-checkout-stepper [currentStep]="checkoutService.checkoutState().step" />

      <div class="row g-4 mt-1">
        <!-- Steps -->
        <div class="col-12 col-lg-8">
          <div class="bg-surface-card border rounded-3 p-4">
            <router-outlet />
          </div>
        </div>

        <!-- Summary -->
        <div class="col-12 col-lg-4">
          <div style="position:sticky;top:80px">
            <app-checkout-order-summary [cart]="cartService.cart()" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutShellComponent {
  readonly checkoutService = inject(CheckoutService);
  readonly cartService     = inject(CartService);
}
