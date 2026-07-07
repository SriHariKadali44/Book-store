import { TestBed } from '@angular/core/testing';
import { QuantityStepperComponent } from './quantity-stepper.component';

describe('QuantityStepperComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [QuantityStepperComponent] });
  });

  it('should emit incremented value on increment()', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.increment();
    expect(emitted).toEqual([4]);
  });

  it('should emit decremented value on decrement()', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.decrement();
    expect(emitted).toEqual([2]);
  });

  it('should NOT emit below min', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    fixture.componentRef.setInput('value', 1);
    fixture.componentRef.setInput('min', 1);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.decrement();
    expect(emitted).toHaveLength(0);
  });

  it('should NOT emit above max', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    fixture.componentRef.setInput('value', 99);
    fixture.componentRef.setInput('max', 99);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.increment();
    expect(emitted).toHaveLength(0);
  });
});
