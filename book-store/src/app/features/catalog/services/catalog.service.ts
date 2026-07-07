import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BookSummary } from '../../../shared/models/book.model';
import { Category } from '../../../shared/models/category.model';
import { CatalogFilters } from '../../../shared/models/catalog-filter.model';
import { PagedResult } from '../../../shared/models/pagination.model';
import { environment } from '../../../../environments/environment';
import { MOCK_ALL_BOOKS } from './catalog.service.mock';
import { MOCK_CATEGORIES } from '../../home/services/home.service.mock';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/books`;

  getBooks(filters: CatalogFilters): Observable<PagedResult<BookSummary>> {
    // --- MOCK ---
    let filtered = [...MOCK_ALL_BOOKS];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (filters.categoryId) {
      filtered = filtered.filter(b => b.categoryId === filters.categoryId);
    }
    if (filters.priceMin != null) {
      filtered = filtered.filter(b => (b.discountPrice ?? b.price) >= filters.priceMin!);
    }
    if (filters.priceMax != null) {
      filtered = filtered.filter(b => (b.discountPrice ?? b.price) <= filters.priceMax!);
    }
    if (filters.rating != null) {
      filtered = filtered.filter(b => b.rating >= filters.rating!);
    }
    if (filters.format?.length) {
      filtered = filtered.filter(b => filters.format!.includes(b.format));
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':  filtered.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)); break;
      case 'price_desc': filtered.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)); break;
      case 'rating':     filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    const totalItems = filtered.length;
    const start = (filters.page - 1) * filters.pageSize;
    const data = filtered.slice(start, start + filters.pageSize);

    return of({
      data,
      meta: {
        page: filters.page,
        pageSize: filters.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / filters.pageSize),
      },
    });
  }

  getCategories(): Observable<Category[]> {
    return of(MOCK_CATEGORIES);
  }
}
