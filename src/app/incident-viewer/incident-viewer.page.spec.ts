import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentViewerPage } from './incident-viewer.page';

describe('IncidentViewerPage', () => {
  let component: IncidentViewerPage;
  let fixture: ComponentFixture<IncidentViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IncidentViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
