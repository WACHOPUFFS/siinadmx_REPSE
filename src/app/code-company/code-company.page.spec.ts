import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeCompanyPage } from './code-company.page';

describe('CodeCompanyPage', () => {
  let component: CodeCompanyPage;
  let fixture: ComponentFixture<CodeCompanyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CodeCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
