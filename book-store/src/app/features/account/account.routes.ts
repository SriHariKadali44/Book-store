import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/account-shell/account-shell.component').then(
        m => m.AccountShellComponent
      ),
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/account-profile/account-profile.component').then(
            m => m.AccountProfileComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/order-list/order-list.component').then(
            m => m.OrderListComponent
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./components/order-detail/order-detail.component').then(
            m => m.OrderDetailComponent
          ),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./components/wishlist/wishlist.component').then(
            m => m.WishlistComponent
          ),
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./components/address-book/address-book.component').then(
            m => m.AddressBookComponent
          ),
      },
    ],
  },
];
