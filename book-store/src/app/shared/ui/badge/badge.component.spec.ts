import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BadgeComponent] });
  });

  it('should render the label text', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('label', 'Bestseller');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Bestseller');
  });

  it('should apply success class for success variant', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('label', 'Active');
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('badge-success');
  });

  it('should apply new class for new variant', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('label', 'New');
    fixture.componentRef.setInput('variant', 'new');
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('badge-new');
  });
});
