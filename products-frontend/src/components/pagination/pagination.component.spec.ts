import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPaginationModule, PaginationComponent], // Import NgbPaginationModule
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
