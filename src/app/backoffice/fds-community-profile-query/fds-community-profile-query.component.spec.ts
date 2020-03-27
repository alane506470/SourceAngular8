import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommunityProfileQueryComponent } from './fds-community-profile-query.component';

describe('FdsCommunityProfileQueryComponent', () => {
  let component: FdsCommunityProfileQueryComponent;
  let fixture: ComponentFixture<FdsCommunityProfileQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommunityProfileQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommunityProfileQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
