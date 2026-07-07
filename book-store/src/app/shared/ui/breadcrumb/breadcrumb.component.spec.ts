import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent, RouterTestingModule],
    });
  });

  it('should render all crumb labels', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('crumbs', [
      { label: 'Home', route: '/' },
      { label: 'Fiction', route: '/catalog' },
      { label: 'The Great Gatsby' },
    ]);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.breadcrumb-item');
    expect(items.length).toBe(3);
  });

  it('should mark last crumb as active with aria-current', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('crumbs', [
      { label: 'Home', route: '/' },
      { label: 'Book' },
    ]);
    fixture.detectChanges();
    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.breadcrumb-item');
    const last = items[items.length - 1];
    expect(last.classList.contains('active')).toBe(true);
    expect(last.getAttribute('aria-current')).toBe('page');
  });

  it('should render link for non-last crumbs', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('crumbs', [
      { label: 'Home', route: '/' },
      { label: 'Current' },
    ]);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(1);
  });
});
