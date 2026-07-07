import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, RouterTestingModule],
    });
  });

  it('should render title and message', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentRef.setInput('title', 'Delete book?');
    fixture.componentRef.setInput('message', 'This will remove the book permanently.');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Delete book?');
    expect(el.textContent).toContain('This will remove the book permanently.');
  });

  it('should emit confirmed and set isOpen=false on onConfirm()', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    const emitSpy = jest.spyOn(fixture.componentInstance.confirmed, 'emit');
    fixture.componentInstance.onConfirm();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('should emit cancelled and set isOpen=false on onCancel()', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    const emitSpy = jest.spyOn(fixture.componentInstance.cancelled, 'emit');
    fixture.componentInstance.onCancel();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('should apply btn-danger class when destructive', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentRef.setInput('destructive', true);
    fixture.detectChanges();
    const dangerBtn = fixture.nativeElement.querySelector('.btn-danger');
    expect(dangerBtn).not.toBeNull();
  });
});
