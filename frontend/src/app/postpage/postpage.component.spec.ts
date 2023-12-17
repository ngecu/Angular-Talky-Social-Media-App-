import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpageComponent } from './postpage.component';

describe('PostpageComponent', () => {
  let component: PostpageComponent;
  let fixture: ComponentFixture<PostpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostpageComponent]
    });
    fixture = TestBed.createComponent(PostpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
