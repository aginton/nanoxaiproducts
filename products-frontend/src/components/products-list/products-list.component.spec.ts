import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsServiceMock: any;

  beforeEach(async () => {
    productsServiceMock = jasmine.createSpyObj('ProductsService', ['searchProducts', 'deleteProducts']);
    productsServiceMock.searchProducts.and.returnValue(of({
      products: [{ id: 1, title: 'Product 1', thumbnail: 'image.jpg', rating: 4, price: 19.99 }],
      total: 1
    }));

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, RouterTestingModule],  // Import ProductsListComponent here
      providers: [{ provide: ProductsService, useValue: productsServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display products on init', () => {
    expect(component.products.length).toBe(1);
    const productRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(productRows.length).toBe(1);
    expect(productRows[0].nativeElement.textContent).toContain('Product 1');
  });

  it('should call deleteProducts when the delete button is clicked', () => {
    component.selectedProductIds = [1];
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('.btn-danger'));
    spyOn(component as any, 'deleteProducts');

    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteProducts).toHaveBeenCalled();
  });
});
