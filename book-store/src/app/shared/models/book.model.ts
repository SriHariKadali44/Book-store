/** Allowed physical/digital formats for a book. */
export type BookFormat = 'paperback' | 'hardcover' | 'ebook' | 'audiobook';

/** Lightweight representation used in listings, grids, and cards. */
export interface BookSummary {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  discountPrice?: number;
  rating: number;          // 0–5, one decimal place
  reviewCount: number;
  categoryId: string;
  format: BookFormat;
  isNew: boolean;
  isBestseller: boolean;
}

/** Full book data used on the detail page. */
export interface BookDetail extends BookSummary {
  description: string;
  publisher: string;
  isbn: string;
  publishedDate: string;   // yyyy-MM-dd — use formatDateForApi when sending to API
  pageCount: number;
  language: string;
  tags: string[];
  relatedBookIds: string[];
}
