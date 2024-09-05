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

  it('should call searchProducts when the search term changes', () => {
    spyOn(component as any, 'searchProducts');
    component.searchTerm = 'New Search';
    component.ngOnChanges({
      searchTerm: {
        currentValue: 'New Search',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.searchProducts).toHaveBeenCalled();
  });

  it('should call searchProducts when the page is changed', () => {
    spyOn(component as any, 'searchProducts');
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.searchProducts).toHaveBeenCalled();
  });

  it('should call searchProducts when the page size is changed', () => {
    spyOn(component as any, 'searchProducts');
    component.onPageSizeChange(50);
    expect(component.pageSize).toBe(50);
    expect(component.currentPage).toBe(1); // Should reset to the first page
    expect(component.searchProducts).toHaveBeenCalled();
  });

  it('should call searchProducts when the sort option is changed', () => {
    spyOn(component as any, 'searchProducts');
    component.onSortChange({ field: 'title', direction: 'ASC' });
    expect(component.sortField).toBe('title');
    expect(component.sortOrder).toBe('ASC');
    expect(component.searchProducts).toHaveBeenCalled();
  });

  it('should navigate to product view when a product row is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.viewProduct(1);
    expect(routerSpy).toHaveBeenCalledWith(['/products/1/view']);
  });

  it('should select or deselect all products when select all checkbox is checked', () => {
    component.products = [
      { id: 1, title: 'Product 1', thumbnail: 'image.jpg', rating: 4, price: 19.99 },
      { id: 2, title: 'Product 2', thumbnail: 'image.jpg', rating: 5, price: 29.99 }
    ];
    fixture.detectChanges();

    const selectAllCheckbox = fixture.debugElement.query(By.css('thead input[type="checkbox"]'));
    selectAllCheckbox.triggerEventHandler('change', { target: { checked: true } });
    expect(component.selectedProductIds).toEqual([1, 2]);

    selectAllCheckbox.triggerEventHandler('change', { target: { checked: false } });
    expect(component.selectedProductIds).toEqual([]);
  });
});
