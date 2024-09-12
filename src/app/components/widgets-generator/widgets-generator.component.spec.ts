import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsGeneratorComponent } from './widgets-generator.component';

describe('WidgetsGeneratorComponent', () => {
  let component: WidgetsGeneratorComponent;
  let fixture: ComponentFixture<WidgetsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetsGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
