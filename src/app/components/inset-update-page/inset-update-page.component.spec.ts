import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsetUpdatePageComponent } from './inset-update-page.component';

describe('InsetUpdatePageComponent', () => {
  let component: InsetUpdatePageComponent;
  let fixture: ComponentFixture<InsetUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsetUpdatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsetUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
