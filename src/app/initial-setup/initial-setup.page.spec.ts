import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialSetupPage } from './initial-setup.page';

describe('InitialSetupPage', () => {
  let component: InitialSetupPage;
  let fixture: ComponentFixture<InitialSetupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InitialSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
