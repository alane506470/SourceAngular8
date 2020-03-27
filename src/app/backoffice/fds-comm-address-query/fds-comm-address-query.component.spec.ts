import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsCommAddressQueryComponent } from './fds-comm-address-query.component';

describe('FdsCommAddressQueryComponent', () => {
  let component: FdsCommAddressQueryComponent;
  let fixture: ComponentFixture<FdsCommAddressQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsCommAddressQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsCommAddressQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
