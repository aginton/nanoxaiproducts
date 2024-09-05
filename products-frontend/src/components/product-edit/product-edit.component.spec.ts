import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditComponent } from './product-edit.component';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {ProductDetails} from "../../model/product-details.model";

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let mockProductsService: any;
  let mockActivatedRoute: any;
  let mockTitle: 'Mock Product Title';
  let mockPrice: 150.99;
  let mockCategory: 'Mock Category';
  let mockDescription: 'Mock Product Description';
  let mockId: 1;

  beforeEach(async () => {
    // Mock ProductsService
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProduct', 'createProduct', 'updateProduct']);
    mockProductsService.getProduct.and.returnValue(of(createMockProduct()));

    // Mock ActivatedRoute
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }  // Simulate product ID as 1
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        RouterTestingModule  // Import RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: ProductsService, useValue: mockProductsService },  // Provide mock service
        { provide: ActivatedRoute, useValue: mockActivatedRoute }  // Provide mock ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function createMockProduct(): ProductDetails {
    return {
      id: mockId,
      title: mockTitle,
      category: mockCategory,
      price: mockPrice,
      description: mockDescription,
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


  it('should populate form fields with product data', async () => {
    // Trigger the data fetching in ngOnInit
    console.log("Inside productEdit component, getProductId returned: ", component.getProductId());
    fixture.detectChanges();

    // Wait for all asynchronous tasks to complete
    await fixture.whenStable();
    console.log("Inside productEdit component, product: ", component.product);

    // Trigger change detection again to ensure the form gets populated
    fixture.detectChanges();


    // Assert form values
    expect(component.productForm.get('id')?.value).toBe(mockId);
    expect(component.productForm.get('title')?.value).toBe(mockTitle);
    expect(component.productForm.get('description')?.value).toBe(mockDescription);
    expect(component.productForm.get('price')?.value).toBe(mockPrice);
    // ... can add more values
  });

  it('should call getProduct with the correct ID', () => {
    fixture.detectChanges();

    expect(mockProductsService.getProduct).toHaveBeenCalledWith(1);
  });
});
