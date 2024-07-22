import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSettingSelectPage } from './user-setting-select.page';

describe('UserSettingSelectPage', () => {
  let component: UserSettingSelectPage;
  let fixture: ComponentFixture<UserSettingSelectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserSettingSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
