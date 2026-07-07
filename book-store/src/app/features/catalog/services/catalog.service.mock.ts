import { BookSummary } from '../../../shared/models/book.model';

export const MOCK_ALL_BOOKS: BookSummary[] = [
  // Fiction
  { id: 'book-1',  title: 'The Midnight Library',                   author: 'Matt Haig',             coverUrl: '', price: 16.99, discountPrice: 12.99, rating: 4.8, reviewCount: 4521, categoryId: 'cat-1', format: 'paperback', isNew: false, isBestseller: true  },
  { id: 'book-6',  title: 'Dune',                                    author: 'Frank Herbert',          coverUrl: '', price: 14.99, discountPrice: 9.99,  rating: 4.8, reviewCount: 11205,categoryId: 'cat-1', format: 'paperback', isNew: false, isBestseller: true  },
  { id: 'book-9',  title: 'Tomorrow, and Tomorrow, and Tomorrow',    author: 'Gabrielle Zevin',        coverUrl: '', price: 18.99, rating: 4.7, reviewCount: 1823, categoryId: 'cat-1', format: 'hardcover', isNew: true,  isBestseller: false },
  { id: 'book-10', title: 'Fourth Wing',                             author: 'Rebecca Yarros',         coverUrl: '', price: 21.99, rating: 4.6, reviewCount: 3102, categoryId: 'cat-1', format: 'hardcover', isNew: true,  isBestseller: true  },
  { id: 'book-11', title: 'Hello Beautiful',                         author: 'Ann Napolitano',         coverUrl: '', price: 17.50, rating: 4.4, reviewCount: 980,  categoryId: 'cat-1', format: 'paperback', isNew: true,  isBestseller: false },
  { id: 'book-13', title: 'Demon Copperhead',                        author: 'Barbara Kingsolver',     coverUrl: '', price: 19.99, rating: 4.5, reviewCount: 2105, categoryId: 'cat-1', format: 'paperback', isNew: true,  isBestseller: false },
  { id: 'book-15', title: 'The Name of the Wind',                    author: 'Patrick Rothfuss',       coverUrl: '', price: 15.99, rating: 4.7, reviewCount: 7230, categoryId: 'cat-1', format: 'ebook',     isNew: false, isBestseller: false },
  { id: 'book-16', title: 'Educated',                                author: 'Tara Westover',          coverUrl: '', price: 16.50, discountPrice: 13.99, rating: 4.8, reviewCount: 6120, categoryId: 'cat-1', format: 'paperback', isNew: false, isBestseller: true  },

  // Non-Fiction
  { id: 'book-2',  title: 'Atomic Habits',                           author: 'James Clear',            coverUrl: '', price: 19.99, rating: 4.9, reviewCount: 8903, categoryId: 'cat-2', format: 'hardcover', isNew: false, isBestseller: true  },
  { id: 'book-5',  title: 'The Psychology of Money',                 author: 'Morgan Housel',          coverUrl: '', price: 15.99, rating: 4.7, reviewCount: 5412, categoryId: 'cat-2', format: 'paperback', isNew: false, isBestseller: true  },
  { id: 'book-12', title: 'The Light We Carry',                      author: 'Michelle Obama',         coverUrl: '', price: 22.00, rating: 4.8, reviewCount: 4211, categoryId: 'cat-2', format: 'hardcover', isNew: true,  isBestseller: true  },
  { id: 'book-14', title: 'Outlive',                                  author: 'Peter Attia',            coverUrl: '', price: 24.99, rating: 4.8, reviewCount: 5320, categoryId: 'cat-2', format: 'hardcover', isNew: true,  isBestseller: true  },
  { id: 'book-17', title: 'Thinking, Fast and Slow',                 author: 'Daniel Kahneman',        coverUrl: '', price: 17.99, discountPrice: 14.50, rating: 4.6, reviewCount: 9021, categoryId: 'cat-2', format: 'paperback', isNew: false, isBestseller: true  },

  // Science
  { id: 'book-4',  title: 'Project Hail Mary',                       author: 'Andy Weir',              coverUrl: '', price: 17.99, rating: 4.9, reviewCount: 3208, categoryId: 'cat-3', format: 'hardcover', isNew: true,  isBestseller: false },
  { id: 'book-7',  title: 'A Brief History of Time',                 author: 'Stephen Hawking',        coverUrl: '', price: 13.99, rating: 4.6, reviewCount: 7832, categoryId: 'cat-3', format: 'ebook',     isNew: false, isBestseller: false },
  { id: 'book-18', title: 'The Selfish Gene',                        author: 'Richard Dawkins',        coverUrl: '', price: 14.50, rating: 4.5, reviewCount: 4215, categoryId: 'cat-3', format: 'paperback', isNew: false, isBestseller: false },
  { id: 'book-19', title: 'Cosmos',                                  author: 'Carl Sagan',             coverUrl: '', price: 16.99, discountPrice: 12.99, rating: 4.8, reviewCount: 5902, categoryId: 'cat-3', format: 'paperback', isNew: false, isBestseller: false },

  // History
  { id: 'book-3',  title: 'Sapiens',                                 author: 'Yuval Noah Harari',      coverUrl: '', price: 18.50, discountPrice: 14.99, rating: 4.7, reviewCount: 6721, categoryId: 'cat-4', format: 'paperback', isNew: false, isBestseller: true  },
  { id: 'book-20', title: 'The Guns of August',                      author: 'Barbara Tuchman',        coverUrl: '', price: 15.99, rating: 4.5, reviewCount: 2103, categoryId: 'cat-4', format: 'paperback', isNew: false, isBestseller: false },
  { id: 'book-21', title: 'Genghis Khan and the Making of the World', author: 'Jack Weatherford',     coverUrl: '', price: 14.99, rating: 4.6, reviewCount: 1820, categoryId: 'cat-4', format: 'paperback', isNew: false, isBestseller: false },

  // Children
  { id: 'book-22', title: 'Where the Wild Things Are',               author: 'Maurice Sendak',         coverUrl: '', price: 9.99,  rating: 4.9, reviewCount: 14200,categoryId: 'cat-5', format: 'hardcover', isNew: false, isBestseller: true  },
  { id: 'book-23', title: 'The Very Hungry Caterpillar',             author: 'Eric Carle',             coverUrl: '', price: 8.99,  rating: 4.9, reviewCount: 18500,categoryId: 'cat-5', format: 'hardcover', isNew: false, isBestseller: true  },
  { id: 'book-24', title: "Charlotte's Web",                         author: 'E.B. White',             coverUrl: '', price: 7.99,  rating: 4.8, reviewCount: 12300,categoryId: 'cat-5', format: 'paperback', isNew: false, isBestseller: true  },

  // Self-Help
  { id: 'book-8',  title: 'The Courage to Be Disliked',             author: 'Ichiro Kishimi',         coverUrl: '', price: 14.50, rating: 4.5, reviewCount: 2891, categoryId: 'cat-8', format: 'paperback', isNew: true,  isBestseller: false },
  { id: 'book-25', title: 'Can\'t Hurt Me',                         author: 'David Goggins',          coverUrl: '', price: 18.99, rating: 4.8, reviewCount: 6210, categoryId: 'cat-8', format: 'audiobook', isNew: false, isBestseller: true  },
  { id: 'book-26', title: 'Man\'s Search for Meaning',              author: 'Viktor E. Frankl',       coverUrl: '', price: 12.50, discountPrice: 9.99, rating: 4.9, reviewCount: 10201, categoryId: 'cat-8', format: 'paperback', isNew: false, isBestseller: true  },
];
