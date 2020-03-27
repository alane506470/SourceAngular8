import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsStewardCalendarAddComponent } from './fds-steward-calendar-add.component';

describe('FdsStewardCalendarAddComponent', () => {
  let component: FdsStewardCalendarAddComponent;
  let fixture: ComponentFixture<FdsStewardCalendarAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsStewardCalendarAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsStewardCalendarAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
