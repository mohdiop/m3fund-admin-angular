import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Histories } from './histories';

describe('Histories', () => {
  let component: Histories;
  let fixture: ComponentFixture<Histories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Histories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Histories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
