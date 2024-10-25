import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualReviewPage } from './mensual-review.page';

describe('MensualReviewPage', () => {
  let component: MensualReviewPage;
  let fixture: ComponentFixture<MensualReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MensualReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
