import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BookSummary } from '../../../shared/models/book.model';
import { Category } from '../../../shared/models/category.model';
import { PromoInfo } from '../models/home.model';
import {
  MOCK_CATEGORIES,
  MOCK_FEATURED_BOOKS,
  MOCK_NEW_ARRIVALS,
  MOCK_PROMOS,
} from './home.service.mock';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);

  getFeaturedBooks(): Observable<BookSummary[]> {
    return of(MOCK_FEATURED_BOOKS);
  }

  getCategories(): Observable<Category[]> {
    return of(MOCK_CATEGORIES);
  }

  getNewArrivals(): Observable<BookSummary[]> {
    return of(MOCK_NEW_ARRIVALS);
  }

  getPromos(): Observable<PromoInfo[]> {
    return of(MOCK_PROMOS);
  }
}
