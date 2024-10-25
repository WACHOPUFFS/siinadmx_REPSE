import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessedAttendancePage } from './processed-attendance.page';

describe('ProcessedAttendancePage', () => {
  let component: ProcessedAttendancePage;
  let fixture: ComponentFixture<ProcessedAttendancePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProcessedAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
