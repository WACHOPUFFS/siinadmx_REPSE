import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodConfigurationPage } from './period-configuration.page';

describe('PeriodConfigurationPage', () => {
  let component: PeriodConfigurationPage;
  let fixture: ComponentFixture<PeriodConfigurationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PeriodConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
