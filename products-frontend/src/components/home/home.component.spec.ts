import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HealthService } from '../../services/healthservice';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let healthServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    healthServiceMock = jasmine.createSpyObj('HealthService', ['ping']);
    healthServiceMock.ping.and.returnValue(of({})); // Return a successful response


    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: HealthService, useValue: healthServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isBackendAlive to true and navigate to /products if ping is successful', () => {
    healthServiceMock.ping.and.returnValue(of({})); // Return a successful response

    component.checkHealth(); // Call the method

    expect(component.isBackendAlive).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should set isBackendAlive to false and navigate to /error if ping fails', () => {
    healthServiceMock.ping.and.returnValue(throwError(() => new Error('Backend is down'))); // Return an error response

    component.checkHealth(); // Call the method

    expect(component.isBackendAlive).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/error']);
  });
});
