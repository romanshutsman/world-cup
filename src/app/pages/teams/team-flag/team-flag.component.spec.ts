import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFlagComponent } from './team-flag.component';

describe('TeamFlagComponent', () => {
  let component: TeamFlagComponent;
  let fixture: ComponentFixture<TeamFlagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamFlagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
