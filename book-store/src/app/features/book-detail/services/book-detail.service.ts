import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BookDetail } from '../../../shared/models/book.model';
import { BookSummary } from '../../../shared/models/book.model';
import { Review, ReviewSummary, CreateReviewDto } from '../../../shared/models/review.model';
import { PagedResult } from '../../../shared/models/pagination.model';
import { MOCK_ALL_BOOKS } from '../../catalog/services/catalog.service.mock';

const MOCK_BOOKS_DETAIL: Record<string, BookDetail> = {};
MOCK_ALL_BOOKS.forEach((b, i) => {
  MOCK_BOOKS_DETAIL[b.id] = {
    ...b,
    description: `A compelling and thought-provoking book by ${b.author}. This title has captivated readers worldwide and remains one of the most celebrated works in its genre. The narrative explores themes of identity, purpose, and the human condition with extraordinary depth.`,
    publisher: 'Penguin Books',
    isbn: `978-0-${String(i + 1).padStart(6, '0')}-0`,
    publishedDate: '2021-09-28',
    pageCount: 200 + (i * 37) % 400,
    language: 'English',
    tags: ['bestseller', b.format, b.categoryId],
    relatedBookIds: MOCK_ALL_BOOKS.filter(x => x.categoryId === b.categoryId && x.id !== b.id).slice(0, 4).map(x => x.id),
  };
});

const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', bookId: 'book-1', userId: 'u-1', userName: 'Alice K.',   rating: 5, title: 'Life-changing!', body: 'This book made me see possibilities I had never considered. Haig\'s writing is simply beautiful.', createdAt: '2023-04-12T10:30:00Z', verifiedPurchase: true  },
  { id: 'rev-2', bookId: 'book-1', userId: 'u-2', userName: 'Mark L.',    rating: 4, title: 'Great read',    body: 'A very engaging story with lots of heart. Some parts felt a bit slow but overall a wonderful experience.', createdAt: '2023-05-01T08:00:00Z', verifiedPurchase: true  },
  { id: 'rev-3', bookId: 'book-1', userId: 'u-3', userName: 'Sarah T.',   rating: 5, title: 'Must-read',     body: 'I loved every page. The concept is unique and the execution is masterful. Highly recommend.', createdAt: '2023-06-18T15:20:00Z', verifiedPurchase: false },
  { id: 'rev-4', bookId: 'book-2', userId: 'u-4', userName: 'James P.',   rating: 5, title: 'Changed habits', body: 'Practical and evidence-based. Already implemented several strategies.', createdAt: '2023-03-09T11:45:00Z', verifiedPurchase: true  },
  { id: 'rev-5', bookId: 'book-2', userId: 'u-5', userName: 'Lisa M.',    rating: 4, title: 'Highly practical', body: 'Great framework for building better habits. Some repetition but the core message is solid.', createdAt: '2023-07-22T09:00:00Z', verifiedPurchase: true  },
];

const MOCK_SUMMARY: ReviewSummary = {
  averageRating: 4.6,
  totalReviews: 4521,
  ratingDistribution: { 5: 2800, 4: 1100, 3: 420, 2: 150, 1: 51 },
};

@Injectable({ providedIn: 'root' })
export class BookDetailService {
  getBook(id: string): Observable<BookDetail | null> {
    return of(MOCK_BOOKS_DETAIL[id] ?? null);
  }

  getReviews(bookId: string, page: number, pageSize: number): Observable<PagedResult<Review>> {
    const all = MOCK_REVIEWS.filter(r => r.bookId === bookId).concat(
      Array.from({ length: 4 }, (_, i) => ({
        id: `rev-gen-${i}`,
        bookId,
        userId: `u-gen-${i}`,
        userName: ['Chris D.', 'Emma R.', 'Tom W.', 'Zoe B.'][i],
        rating: [5, 4, 5, 3][i],
        title: ['Fantastic', 'Good', 'Loved it', 'Decent'][i],
        body: 'An excellent addition to any bookshelf. Well written and engaging from start to finish.',
        createdAt: `2023-0${i + 3}-10T12:00:00Z`,
        verifiedPurchase: i % 2 === 0,
      }))
    );
    const start = (page - 1) * pageSize;
    return of({
      data: all.slice(start, start + pageSize),
      meta: { page, pageSize, totalItems: all.length, totalPages: Math.ceil(all.length / pageSize) },
    });
  }

  getReviewSummary(_bookId: string): Observable<ReviewSummary> {
    return of(MOCK_SUMMARY);
  }

  submitReview(bookId: string, dto: CreateReviewDto): Observable<Review> {
    const review: Review = {
      id: `rev-new-${Date.now()}`,
      bookId,
      userId: 'current-user',
      userName: 'You',
      ...dto,
      createdAt: new Date().toISOString(),
      verifiedPurchase: false,
    };
    return of(review);
  }

  getRelatedBooks(bookId: string): Observable<BookSummary[]> {
    const book = MOCK_BOOKS_DETAIL[bookId];
    if (!book) return of([]);
    return of(
      MOCK_ALL_BOOKS.filter(b => book.relatedBookIds.includes(b.id)).slice(0, 6)
    );
  }
}
