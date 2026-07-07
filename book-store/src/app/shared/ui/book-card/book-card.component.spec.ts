import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { BookCardComponent } from './book-card.component';
import { BookSummary } from '../../models/book.model';

const MOCK_BOOK: BookSummary = {
  id: 'book-1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  coverUrl: '',
  price: 14.99,
  discountPrice: 9.99,
  rating: 4.5,
  reviewCount: 312,
  categoryId: 'cat-fiction',
  format: 'paperback',
  isNew: true,
  isBestseller: false,
};

describe('BookCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookCardComponent, RouterTestingModule],
    });
  });

  it('should render book title and author', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentRef.setInput('book', MOCK_BOOK);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('The Great Gatsby');
    expect(el.textContent).toContain('F. Scott Fitzgerald');
  });

  it('should emit addToCart with book when Add to Cart clicked', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentRef.setInput('book', MOCK_BOOK);
    fixture.detectChanges();
    const emitted: BookSummary[] = [];
    outputToObservable(fixture.componentInstance.addToCart).subscribe((b: BookSummary) =>
      emitted.push(b)
    );
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn-accent');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(emitted).toHaveLength(1);
    expect(emitted[0].id).toBe('book-1');
  });

  it('should toggle wishlist and emit wishlistToggle', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentRef.setInput('book', MOCK_BOOK);
    fixture.componentRef.setInput('showWishlist', true);
    fixture.detectChanges();
    const emitted: { wishlisted: boolean }[] = [];
    outputToObservable(fixture.componentInstance.wishlistToggle).subscribe(
      (e: { book: BookSummary; wishlisted: boolean }) => emitted.push(e)
    );
    fixture.componentInstance.toggleWishlist();
    fixture.detectChanges();
    expect(emitted[0].wishlisted).toBe(true);
    fixture.componentInstance.toggleWishlist();
    fixture.detectChanges();
    expect(emitted[1].wishlisted).toBe(false);
  });

  it('should show New badge when book.isNew', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentRef.setInput('book', MOCK_BOOK);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('New');
  });
});
