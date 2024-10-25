import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentControlPage } from './incident-control.page';

describe('IncidentControlPage', () => {
  let component: IncidentControlPage;
  let fixture: ComponentFixture<IncidentControlPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
