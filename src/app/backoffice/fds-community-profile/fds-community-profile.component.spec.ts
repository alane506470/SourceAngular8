import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommunityProfileComponent } from './fds-community-profile.component';

describe('FdsCommunityProfileComponent', () => {
  let component: FdsCommunityProfileComponent;
  let fixture: ComponentFixture<FdsCommunityProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommunityProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommunityProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
