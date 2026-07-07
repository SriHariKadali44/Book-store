import { TestBed } from '@angular/core/testing';
import { PriceDisplayComponent } from './price-display.component';

describe('PriceDisplayComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PriceDisplayComponent] });
  });

  it('should display price without strikethrough when no discount', () => {
    const fixture = TestBed.createComponent(PriceDisplayComponent);
    fixture.componentRef.setInput('price', 29.99);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('$29.99');
    expect(el.querySelector('.text-decoration-line-through')).toBeNull();
  });

  it('should display discounted price with strikethrough on original', () => {
    const fixture = TestBed.createComponent(PriceDisplayComponent);
    fixture.componentRef.setInput('price', 29.99);
    fixture.componentRef.setInput('discountPrice', 19.99);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('$19.99');
    expect(el.querySelector('.text-decoration-line-through')).not.toBeNull();
  });

  it('should not show strikethrough when discountPrice equals price', () => {
    const fixture = TestBed.createComponent(PriceDisplayComponent);
    fixture.componentRef.setInput('price', 20);
    fixture.componentRef.setInput('discountPrice', 20);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.text-decoration-line-through')).toBeNull();
  });
});
