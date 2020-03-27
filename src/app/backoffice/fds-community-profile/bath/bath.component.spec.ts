import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BathComponent } from './bath.component';

describe('BathComponent', () => {
  let component: BathComponent;
  let fixture: ComponentFixture<BathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
