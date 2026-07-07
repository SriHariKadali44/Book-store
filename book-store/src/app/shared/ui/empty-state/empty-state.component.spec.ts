import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmptyStateComponent] });
  });

  it('should render title and description', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No books found');
    fixture.componentRef.setInput('description', 'Try a different search term.');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No books found');
    expect(el.textContent).toContain('Try a different search term.');
  });

  it('should NOT render CTA button when ctaLabel is empty', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('ctaLabel', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('should render CTA button with correct label when ctaLabel is set', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('ctaLabel', 'Start Shopping');
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn.textContent?.trim()).toBe('Start Shopping');
  });

  it('should call ctaClick.emit when button is clicked', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('ctaLabel', 'Browse Books');
    fixture.detectChanges();
    const emitSpy = jest.spyOn(fixture.componentInstance.ctaClick, 'emit');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
