import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {HealthService} from "../services/healthservice";

describe('AppComponent', () => {
  let healthServiceMock: any;

  beforeEach(async () => {
    // Create a mock of HealthService
    healthServiceMock = jasmine.createSpyObj('HealthService', ['ping']);
    healthServiceMock.ping.and.returnValue(of('Backend is alive')); // Mock a successful response

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: HealthService, useValue: healthServiceMock }] // Provide the mock service
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'products-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('products-frontend');
  });
});
