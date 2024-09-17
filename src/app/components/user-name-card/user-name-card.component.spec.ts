import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameCardComponent } from './user-name-card.component';

describe('UserNameCardComponent', () => {
  let component: UserNameCardComponent;
  let fixture: ComponentFixture<UserNameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNameCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
