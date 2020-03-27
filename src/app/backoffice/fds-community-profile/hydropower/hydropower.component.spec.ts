import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HydropowerComponent } from './hydropower.component';

describe('HydropowerComponent', () => {
  let component: HydropowerComponent;
  let fixture: ComponentFixture<HydropowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HydropowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HydropowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
