import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueDetailsComponent } from './mosque-details.component';

describe('MosqueDetailsComponent', () => {
  let component: MosqueDetailsComponent;
  let fixture: ComponentFixture<MosqueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqueDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
