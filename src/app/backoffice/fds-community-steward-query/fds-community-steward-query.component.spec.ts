import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommunityStewardQueryComponent } from './fds-community-steward-query.component';

describe('FdsCommunityStewardQueryComponent', () => {
  let component: FdsCommunityStewardQueryComponent;
  let fixture: ComponentFixture<FdsCommunityStewardQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommunityStewardQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommunityStewardQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
