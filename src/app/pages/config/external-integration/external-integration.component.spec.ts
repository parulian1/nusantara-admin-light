import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIntegrationComponent } from './external-integration.component';

describe('ExternalIntegrationComponent', () => {
  let component: ExternalIntegrationComponent;
  let fixture: ComponentFixture<ExternalIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
