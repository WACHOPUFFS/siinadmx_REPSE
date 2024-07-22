import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceivedPage } from './received.page';

describe('ReceivedPage', () => {
  let component: ReceivedPage;
  let fixture: ComponentFixture<ReceivedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReceivedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
