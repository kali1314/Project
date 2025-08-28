import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitHome } from './init-home';

describe('InitHome', () => {
  let component: InitHome;
  let fixture: ComponentFixture<InitHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
