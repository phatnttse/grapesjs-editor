import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsManagerComponent } from './assets-manager.component';

describe('AssetsManagerComponent', () => {
  let component: AssetsManagerComponent;
  let fixture: ComponentFixture<AssetsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
