import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateInsertUpdateComponent } from './template-insert-update.component';

describe('TemplateInsertUpdateComponent', () => {
  let component: TemplateInsertUpdateComponent;
  let fixture: ComponentFixture<TemplateInsertUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateInsertUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateInsertUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
