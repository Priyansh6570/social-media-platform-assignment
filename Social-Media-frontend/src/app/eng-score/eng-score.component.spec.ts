import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngScoreComponent } from './eng-score.component';

describe('EngScoreComponent', () => {
  let component: EngScoreComponent;
  let fixture: ComponentFixture<EngScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngScoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EngScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
