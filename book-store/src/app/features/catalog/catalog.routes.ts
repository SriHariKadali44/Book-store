import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/catalog/catalog.component').then(m => m.CatalogComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../book-detail/components/book-detail/book-detail.component').then(
        m => m.BookDetailComponent
      ),
  },
];
