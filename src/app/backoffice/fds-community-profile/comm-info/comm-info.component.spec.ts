import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommInfoComponent } from './comm-info.component';

describe('CommInfoComponent', () => {
  let component: CommInfoComponent;
  let fixture: ComponentFixture<CommInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
