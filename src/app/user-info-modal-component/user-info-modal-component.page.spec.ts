import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoModalComponentPage } from './user-info-modal-component.page';

describe('UserInfoModalComponentPage', () => {
  let component: UserInfoModalComponentPage;
  let fixture: ComponentFixture<UserInfoModalComponentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserInfoModalComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
