import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductViewComponent } from './product-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';
import { ProductDetails } from '../../model/product-details.model';
import { ActivatedRoute } from '@angular/router';

describe('ProductViewComponent', () => {
  let component: ProductViewComponent;
  let fixture: ComponentFixture<ProductViewComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock ProductsService
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProduct', 'deleteProduct']);
    mockProductsService.getProduct.and.returnValue(of(createMockProduct()));

    // Mock ActivatedRoute
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }  // Simulate product ID as 1
    };

    await TestBed.configureTestingModule({
      imports: [ProductViewComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Mock Product Details
  function createMockProduct(): ProductDetails {
    return {
      id: 1,
      title: 'Test Product',  // Ensure the title matches expectation
      category: 'Test Category',
      price: 15.99,
      description: 'Test Description',  // Ensure the description matches expectation
      discountPercentage: 10,
      rating: 4.5,
      stock: 100,
      brand: 'Mock Brand',
      sku: 'MOCKSKU123',
      weight: 1.2,
      dimensions: {
        width: 10,
        height: 20,
        depth: 5
      },
      warrantyInformation: '2-year warranty',
      shippingInformation: 'Ships within 5 days',
      returnPolicy: '30-day return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        barcode: '123456789012',
        qrCode: 'mock-qrcode'
      },
      tags: ['electronics', 'sale', 'featured'],
      images: ['image1.jpg', 'image2.jpg'],
      reviews: [
        {
          rating: 5,
          comment: 'Excellent product!',
          date: '2024-02-01',
          reviewerName: 'John Doe',
          reviewerEmail: 'john.doe@example.com'
        }
      ],
      thumbnail: 'thumbnail.jpg'
    };
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product on initialization', () => {
    spyOn(component, 'fetchProduct');  // Spy on the fetchProduct method

    component.ngOnInit();  // Trigger ngOnInit
    expect(component.fetchProduct).toHaveBeenCalled();  // Ensure fetchProduct was called
  });

  it('should call getProduct with correct ID during initialization', () => {
    // Simulate the component initialization and fetching of product
    expect(mockProductsService.getProduct).toHaveBeenCalledWith(1);
    expect(component.product?.title).toBe('Test Product');  // Check if the product title matches
  });

  it('should display product details in the template', () => {
    component.product = createMockProduct();  // Manually set the mock product

    fixture.detectChanges();  // Trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-title')?.textContent).toContain('Test Product');  // Test title
    expect(compiled.querySelector('.product-thumbnail')?.getAttribute('src')).toBe('thumbnail.jpg');  // Test thumbnail
    expect(compiled.querySelector('.product-section p')?.textContent).toContain('Test Description');  // Test description
  });

  it('should navigate to edit product on edit button click', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    // Call the method to simulate the edit button click
    component.editProduct();

    // Check that the router is navigating to the correct route
    expect(routerSpy).toHaveBeenCalledWith([`/products/${component.productId}/edit`]);
  });

  it('should call deleteProduct on service and navigate after deletion', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.productId = 1;  // Ensure the productId is set
    mockProductsService.deleteProduct.and.returnValue(of({}));  // Simulate a successful delete

    // Call the method
    component.deleteProduct();

    // Verify that deleteProduct was called with the correct productId
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);

    // Verify that navigation to the product list occurred
    expect(routerSpy).toHaveBeenCalledWith([`/products`]);
  });

  it('should show loading state when product is being fetched', () => {
    component.product = null;  // Simulate product not being available yet
    fixture.detectChanges();  // Trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;
    const loadingMessage = compiled.querySelector('p')?.textContent;  // Select <p> instead of <ng-template>

    expect(loadingMessage).toContain('Loading product details...');
  });

});
