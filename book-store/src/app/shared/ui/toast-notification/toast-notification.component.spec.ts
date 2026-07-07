import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastNotificationComponent } from './toast-notification.component';
import { ToastService } from '../../../core/services/toast.service';

describe('ToastNotificationComponent', () => {
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ToastNotificationComponent] });
    toastService = TestBed.inject(ToastService);
  });

  it('should render nothing when no toasts', () => {
    const fixture = TestBed.createComponent(ToastNotificationComponent);
    fixture.detectChanges();
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });

  it('should render a toast when service has one', fakeAsync(() => {
    toastService.show('Saved successfully', 'success', 4000);
    const fixture = TestBed.createComponent(ToastNotificationComponent);
    fixture.detectChanges();
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Saved successfully');
    tick(5000);
  }));

  it('should apply success class for success type', fakeAsync(() => {
    toastService.show('Done', 'success', 4000);
    const fixture = TestBed.createComponent(ToastNotificationComponent);
    fixture.detectChanges();
    const toast: HTMLElement = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('text-bg-success')).toBe(true);
    tick(5000);
  }));

  it('should dismiss toast when close button clicked', fakeAsync(() => {
    toastService.show('Hello', 'info', 4000);
    const fixture = TestBed.createComponent(ToastNotificationComponent);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-close');
    btn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(0);
    tick(5000);
  }));
});
