import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorepageComponent } from './explorepage.component';

describe('ExplorepageComponent', () => {
  let component: ExplorepageComponent;
  let fixture: ComponentFixture<ExplorepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorepageComponent]
    });
    fixture = TestBed.createComponent(ExplorepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
