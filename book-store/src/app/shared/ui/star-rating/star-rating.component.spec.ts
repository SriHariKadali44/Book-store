import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StarRatingComponent, RouterTestingModule],
    });
  });

  it('should render 5 stars', () => {
    const fixture = TestBed.createComponent(StarRatingComponent);
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();
    const icons = fixture.debugElement.queryAll(By.css('.material-icons'));
    expect(icons.length).toBe(5);
  });

  it('should mark correct stars as filled for value 3.5', () => {
    const fixture = TestBed.createComponent(StarRatingComponent);
    fixture.componentRef.setInput('value', 3.5);
    fixture.detectChanges();
    const stars = fixture.componentInstance.stars();
    expect(stars[0].type).toBe('full');
    expect(stars[1].type).toBe('full');
    expect(stars[2].type).toBe('full');
    expect(stars[3].type).toBe('half');
    expect(stars[4].type).toBe('empty');
  });

  it('should emit ratingChange when interactive and star clicked', () => {
    const fixture = TestBed.createComponent(StarRatingComponent);
    fixture.componentRef.setInput('value', 0);
    fixture.componentRef.setInput('interactive', true);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.ratingChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.onStarClick(4);
    expect(emitted).toEqual([4]);
  });

  it('should NOT emit ratingChange when not interactive', () => {
    const fixture = TestBed.createComponent(StarRatingComponent);
    fixture.componentRef.setInput('value', 0);
    fixture.componentRef.setInput('interactive', false);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.ratingChange.subscribe((v: number) => emitted.push(v));
    fixture.componentInstance.onStarClick(3);
    expect(emitted).toHaveLength(0);
  });
});
