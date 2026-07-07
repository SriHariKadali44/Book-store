import { TestBed } from '@angular/core/testing';
import { LoadingSkeletonComponent } from './loading-skeleton.component';

describe('LoadingSkeletonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LoadingSkeletonComponent] });
  });

  it('should render card skeletons', () => {
    const fixture = TestBed.createComponent(LoadingSkeletonComponent);
    fixture.componentRef.setInput('type', 'card');
    fixture.componentRef.setInput('rows', 4);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toBe(4);
  });

  it('should render list skeletons', () => {
    const fixture = TestBed.createComponent(LoadingSkeletonComponent);
    fixture.componentRef.setInput('type', 'list');
    fixture.componentRef.setInput('rows', 3);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.d-flex.align-items-center');
    expect(rows.length).toBe(3);
  });

  it('should render text skeletons', () => {
    const fixture = TestBed.createComponent(LoadingSkeletonComponent);
    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('rows', 5);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.skeleton.rounded');
    expect(lines.length).toBe(5);
  });
});
