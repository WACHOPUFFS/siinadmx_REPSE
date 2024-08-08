import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlWorksPage } from './control-works.page';

describe('ControlWorksPage', () => {
  let component: ControlWorksPage;
  let fixture: ComponentFixture<ControlWorksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlWorksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
