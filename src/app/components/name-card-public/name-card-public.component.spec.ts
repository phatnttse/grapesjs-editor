import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCardPublicComponent } from './name-card-public.component';

describe('NameCardPublicComponent', () => {
  let component: NameCardPublicComponent;
  let fixture: ComponentFixture<NameCardPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameCardPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameCardPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
