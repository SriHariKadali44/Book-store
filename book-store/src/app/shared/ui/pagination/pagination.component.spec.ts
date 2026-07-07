import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { PaginationMeta } from '../../models/pagination.model';

const META: PaginationMeta = { page: 1, pageSize: 12, totalItems: 100, totalPages: 9 };

describe('PaginationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PaginationComponent] });
  });

  it('should render pagination when totalPages > 1', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('meta', META);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).not.toBeNull();
  });

  it('should NOT render pagination when totalPages <= 1', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('meta', { ...META, totalPages: 1 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });

  it('should emit pageChange when a page button is clicked', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('meta', { ...META, page: 3, totalPages: 5 });
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((p: number) => emitted.push(p));
    fixture.componentInstance.onPage(4);
    expect(emitted).toEqual([4]);
  });

  it('should NOT emit for current page', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('meta', META);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((p: number) => emitted.push(p));
    fixture.componentInstance.onPage(1); // already on page 1
    expect(emitted).toHaveLength(0);
  });

  it('should insert ellipsis for large page counts', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('meta', { ...META, page: 5, totalPages: 20 });
    fixture.detectChanges();
    const pages = fixture.componentInstance.pages();
    expect(pages).toContain(-1);
  });
});
