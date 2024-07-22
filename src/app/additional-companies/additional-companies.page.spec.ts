import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalCompaniesPage } from './additional-companies.page';

describe('AdditionalCompaniesPage', () => {
  let component: AdditionalCompaniesPage;
  let fixture: ComponentFixture<AdditionalCompaniesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdditionalCompaniesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
