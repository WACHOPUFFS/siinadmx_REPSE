import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyRequestPage } from './company-request.page';

describe('CompanyRequestPage', () => {
  let component: CompanyRequestPage;
  let fixture: ComponentFixture<CompanyRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
