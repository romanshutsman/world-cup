import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTierComponent } from './user-tier.component';

describe('UserTierComponent', () => {
  let component: UserTierComponent;
  let fixture: ComponentFixture<UserTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
