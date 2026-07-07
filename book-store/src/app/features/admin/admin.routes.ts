import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/admin-shell/admin-shell.component').then(
        m => m.AdminShellComponent
      ),
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      {
        path: 'books',
        loadComponent: () =>
          import('./components/admin-books/admin-books.component').then(
            m => m.AdminBooksComponent
          ),
      },
      {
        path: 'books/new',
        loadComponent: () =>
          import('./components/admin-book-form/admin-book-form.component').then(
            m => m.AdminBookFormComponent
          ),
      },
      {
        path: 'books/:id/edit',
        loadComponent: () =>
          import('./components/admin-book-form/admin-book-form.component').then(
            m => m.AdminBookFormComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/admin-categories/admin-categories.component').then(
            m => m.AdminCategoriesComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/admin-orders/admin-orders.component').then(
            m => m.AdminOrdersComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./components/admin-inventory/admin-inventory.component').then(
            m => m.AdminInventoryComponent
          ),
      },
    ],
  },
];
