import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesInfoPage } from './companies-info.page';

describe('CompaniesInfoPage', () => {
  let component: CompaniesInfoPage;
  let fixture: ComponentFixture<CompaniesInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompaniesInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
