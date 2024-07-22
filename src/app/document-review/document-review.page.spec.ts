import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentReviewPage } from './document-review.page';

describe('DocumentReviewPage', () => {
  let component: DocumentReviewPage;
  let fixture: ComponentFixture<DocumentReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DocumentReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
