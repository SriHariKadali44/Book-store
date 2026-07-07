import { Routes } from '@angular/router';

export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/checkout-shell/checkout-shell.component').then(
        m => m.CheckoutShellComponent
      ),
    children: [
      { path: '', redirectTo: 'address', pathMatch: 'full' },
      {
        path: 'address',
        loadComponent: () =>
          import('./components/checkout-address/checkout-address.component').then(
            m => m.CheckoutAddressComponent
          ),
      },
      {
        path: 'shipping',
        loadComponent: () =>
          import('./components/checkout-shipping/checkout-shipping.component').then(
            m => m.CheckoutShippingComponent
          ),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('./components/checkout-payment/checkout-payment.component').then(
            m => m.CheckoutPaymentComponent
          ),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./components/checkout-confirmation/checkout-confirmation.component').then(
            m => m.CheckoutConfirmationComponent
          ),
      },
    ],
  },
];
