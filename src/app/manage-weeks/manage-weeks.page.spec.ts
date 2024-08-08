import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageWeeksPage } from './manage-weeks.page';

describe('ManageWeeksPage', () => {
  let component: ManageWeeksPage;
  let fixture: ComponentFixture<ManageWeeksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageWeeksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
