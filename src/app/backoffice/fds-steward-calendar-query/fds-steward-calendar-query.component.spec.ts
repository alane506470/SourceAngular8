import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsStewardCalendarQueryComponent } from './fds-steward-calendar-query.component';

describe('FdsStewardCalendarQueryComponent', () => {
  let component: FdsStewardCalendarQueryComponent;
  let fixture: ComponentFixture<FdsStewardCalendarQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsStewardCalendarQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsStewardCalendarQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
