import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepsePage } from './repse.page';

describe('RepsePage', () => {
  let component: RepsePage;
  let fixture: ComponentFixture<RepsePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
