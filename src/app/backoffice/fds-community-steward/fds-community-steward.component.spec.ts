import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommunityStewardComponent } from './fds-community-steward.component';

describe('FdsCommunityStewardComponent', () => {
  let component: FdsCommunityStewardComponent;
  let fixture: ComponentFixture<FdsCommunityStewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommunityStewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommunityStewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
