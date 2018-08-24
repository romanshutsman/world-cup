import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalWrongComponent } from './paypal-wrong.component';

describe('PaypalWrongComponent', () => {
  let component: PaypalWrongComponent;
  let fixture: ComponentFixture<PaypalWrongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalWrongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
