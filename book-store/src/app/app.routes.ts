import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout-shell/layout-shell.component').then(
        m => m.LayoutShellComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/components/home/home.component').then(
            m => m.HomeComponent
          ),
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then(m => m.catalogRoutes),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/components/cart/cart.component').then(
            m => m.CartComponent
          ),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then(m => m.checkoutRoutes),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.authRoutes),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/account/account.routes').then(m => m.accountRoutes),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/admin/admin.routes').then(m => m.adminRoutes),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            m => m.NotFoundComponent
          ),
      },
    ],
  },
];
