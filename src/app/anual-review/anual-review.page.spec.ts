import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnualReviewPage } from './anual-review.page';

describe('AnualReviewPage', () => {
  let component: AnualReviewPage;
  let fixture: ComponentFixture<AnualReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnualReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
