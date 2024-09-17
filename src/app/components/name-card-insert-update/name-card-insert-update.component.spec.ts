import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCardInsertUpdateComponent } from './name-card-insert-update.component';

describe('NameCardInsertUpdateComponent', () => {
  let component: NameCardInsertUpdateComponent;
  let fixture: ComponentFixture<NameCardInsertUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameCardInsertUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameCardInsertUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
