import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodePersonPage } from './code-person.page';

describe('CodePersonPage', () => {
  let component: CodePersonPage;
  let fixture: ComponentFixture<CodePersonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CodePersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
