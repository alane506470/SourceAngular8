import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommAddressAddComponent } from './fds-comm-address-add.component';

describe('FdsCommAddressAddComponent', () => {
  let component: FdsCommAddressAddComponent;
  let fixture: ComponentFixture<FdsCommAddressAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommAddressAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommAddressAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
