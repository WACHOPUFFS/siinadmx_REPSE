import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmWeekPage } from './confirm-week.page';

describe('ConfirmWeekPage', () => {
  let component: ConfirmWeekPage;
  let fixture: ComponentFixture<ConfirmWeekPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmWeekPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
