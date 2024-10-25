import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDayPage } from './confirm-day.page';

describe('ConfirmDayPage', () => {
  let component: ConfirmDayPage;
  let fixture: ComponentFixture<ConfirmDayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
