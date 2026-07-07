import { BookSummary } from '../../../shared/models/book.model';
import { Category } from '../../../shared/models/category.model';
import { PromoInfo } from '../models/home.model';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Fiction',      slug: 'fiction',      iconName: 'auto_stories',  bookCount: 142 },
  { id: 'cat-2', name: 'Non-Fiction',  slug: 'non-fiction',  iconName: 'library_books', bookCount: 98  },
  { id: 'cat-3', name: 'Science',      slug: 'science',      iconName: 'science',       bookCount: 67  },
  { id: 'cat-4', name: 'History',      slug: 'history',      iconName: 'history_edu',   bookCount: 54  },
  { id: 'cat-5', name: 'Children',     slug: 'children',     iconName: 'child_care',    bookCount: 89  },
  { id: 'cat-6', name: 'Biography',    slug: 'biography',    iconName: 'person_book',   bookCount: 43  },
  { id: 'cat-7', name: 'Technology',   slug: 'technology',   iconName: 'devices',       bookCount: 76  },
  { id: 'cat-8', name: 'Self-Help',    slug: 'self-help',    iconName: 'self_improvement', bookCount: 61 },
];

export const MOCK_FEATURED_BOOKS: BookSummary[] = [
  { id: 'book-1', title: 'The Midnight Library', author: 'Matt Haig', coverUrl: '', price: 16.99, discountPrice: 12.99, rating: 4.8, reviewCount: 4521, categoryId: 'cat-1', format: 'paperback', isNew: false, isBestseller: true },
  { id: 'book-2', title: 'Atomic Habits', author: 'James Clear', coverUrl: '', price: 19.99, rating: 4.9, reviewCount: 8903, categoryId: 'cat-2', format: 'hardcover', isNew: false, isBestseller: true },
  { id: 'book-3', title: 'Sapiens', author: 'Yuval Noah Harari', coverUrl: '', price: 18.50, discountPrice: 14.99, rating: 4.7, reviewCount: 6721, categoryId: 'cat-4', format: 'paperback', isNew: false, isBestseller: true },
  { id: 'book-4', title: 'Project Hail Mary', author: 'Andy Weir', coverUrl: '', price: 17.99, rating: 4.9, reviewCount: 3208, categoryId: 'cat-3', format: 'hardcover', isNew: true, isBestseller: false },
  { id: 'book-5', title: 'The Psychology of Money', author: 'Morgan Housel', coverUrl: '', price: 15.99, rating: 4.7, reviewCount: 5412, categoryId: 'cat-2', format: 'paperback', isNew: false, isBestseller: true },
  { id: 'book-6', title: 'Dune', author: 'Frank Herbert', coverUrl: '', price: 14.99, discountPrice: 9.99, rating: 4.8, reviewCount: 11205, categoryId: 'cat-1', format: 'paperback', isNew: false, isBestseller: true },
  { id: 'book-7', title: 'A Brief History of Time', author: 'Stephen Hawking', coverUrl: '', price: 13.99, rating: 4.6, reviewCount: 7832, categoryId: 'cat-3', format: 'ebook', isNew: false, isBestseller: false },
  { id: 'book-8', title: 'The Courage to Be Disliked', author: 'Ichiro Kishimi', coverUrl: '', price: 14.50, rating: 4.5, reviewCount: 2891, categoryId: 'cat-8', format: 'paperback', isNew: true, isBestseller: false },
];

export const MOCK_NEW_ARRIVALS: BookSummary[] = [
  { id: 'book-9',  title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin',   coverUrl: '', price: 18.99, rating: 4.7, reviewCount: 1823, categoryId: 'cat-1', format: 'hardcover', isNew: true,  isBestseller: false },
  { id: 'book-10', title: 'Fourth Wing',                          author: 'Rebecca Yarros',     coverUrl: '', price: 21.99, rating: 4.6, reviewCount: 3102, categoryId: 'cat-1', format: 'hardcover', isNew: true,  isBestseller: true  },
  { id: 'book-11', title: 'Hello Beautiful',                      author: 'Ann Napolitano',     coverUrl: '', price: 17.50, rating: 4.4, reviewCount: 980,  categoryId: 'cat-1', format: 'paperback', isNew: true,  isBestseller: false },
  { id: 'book-12', title: 'The Light We Carry',                   author: 'Michelle Obama',     coverUrl: '', price: 22.00, rating: 4.8, reviewCount: 4211, categoryId: 'cat-2', format: 'hardcover', isNew: true,  isBestseller: true  },
  { id: 'book-13', title: 'Demon Copperhead',                     author: 'Barbara Kingsolver', coverUrl: '', price: 19.99, rating: 4.5, reviewCount: 2105, categoryId: 'cat-1', format: 'paperback', isNew: true,  isBestseller: false },
  { id: 'book-14', title: 'Outlive',                              author: 'Peter Attia',        coverUrl: '', price: 24.99, rating: 4.8, reviewCount: 5320, categoryId: 'cat-2', format: 'hardcover', isNew: true,  isBestseller: true  },
];

export const MOCK_PROMOS: PromoInfo[] = [
  {
    id: 'promo-1',
    title:    'Summer Reading Sale',
    subtitle: 'Up to 40% off bestsellers — this week only.',
    ctaLabel: 'Shop Sale',
    ctaRoute: '/catalog',
    backgroundColor: 'var(--brand-accent)',
  },
  {
    id: 'promo-2',
    title:    'New Member Bonus',
    subtitle: 'Get 20% off your first order with code WELCOME20.',
    ctaLabel: 'Register Now',
    ctaRoute: '/auth/register',
    backgroundColor: 'var(--brand-primary)',
  },
];
