import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ProductDetails } from '../../model/product-details.model';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import {ErrorModalComponent} from "../error-modal/error-modal.component";

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErrorModalComponent],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  product: ProductDetails | null = null;  // Initialize with null
  productForm: FormGroup;
  isCreateMode: boolean = false;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.['product'] || null;

    this.productForm = this.fb.group({
      id: [null],
      title: [''],
      description: [''],
      category: [''],
      price: [''],
      discountPercentage: ['', [Validators.min(0), Validators.max(100)]],
      rating: ['', [Validators.min(0), Validators.max(5)]],
      stock: ['', [Validators.min(0)]],
      brand: [''],
      sku: [''],
      weight: ['', [Validators.min(0)]],
      dimensions: this.fb.group({
        width: [''],
        height: [''],
        depth: ['']
      }),
      warrantyInformation: [''],
      shippingInformation: [''],
      thumbnail: [''],
      returnPolicy: [''],
      minimumOrderQuantity: ['', [Validators.min(1)]],
      meta: this.fb.group({
        createdAt: [''],
        updatedAt: [''],
        barcode: [''],
        qrCode: ['']
      }),
      tags: this.fb.array([]),
      images: this.fb.array([]),
      reviews: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.isCreateMode = !productId;

    if (this.isCreateMode) {
      console.log("is inCreateMode, initializing form using empty product");
      this.initializeEmptyProduct();
    } else if (this.product) {
      console.log("in edit mode, already have product in state. Using to initialize form");
      this.populateForm(this.product);
    } else if (productId) {
      console.log("in edit mode, did not have value for product. Fetching product using id ", productId, " and using to populate form");
      this.fetchProductAndPopulateForm(Number(productId));
    }
  }

  getProductId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  initializeEmptyProduct(): void {
    this.product = {
      id: 0,
      title: '',
      description: '',
      category: '',
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      tags: [],
      brand: '',
      sku: '',
      weight: 0,
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
      warrantyInformation: '',
      shippingInformation: '',
      reviews: [],
      returnPolicy: '',
      minimumOrderQuantity: 0,
      meta: {
        createdAt: '',
        updatedAt: '',
        barcode: '',
        qrCode: '',
      },
      images: [],
      thumbnail: '',
    };
  }

  fetchProductAndPopulateForm(productId: number): void {
    this.productsService.getProduct(productId).subscribe(product => {
      if (product) {
        this.product = product;
        this.populateForm(product);
      }
    });
  }

  populateForm(product: ProductDetails): void {
    console.log("Populating form with product: ", product)
    this.productForm.patchValue({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      sku: product.sku,
      weight: product.weight,
      dimensions: {
        width: product.dimensions.width,
        height: product.dimensions.height,
        depth: product.dimensions.depth,
      },
      warrantyInformation: product.warrantyInformation,
      shippingInformation: product.shippingInformation,
      returnPolicy: product.returnPolicy,
      minimumOrderQuantity: product.minimumOrderQuantity,
      meta: {
        createdAt: product.meta.createdAt,
        updatedAt: product.meta.updatedAt,
        barcode: product.meta.barcode,
        qrCode: product.meta.qrCode,
      },
      thumbnail: product.thumbnail
    });

    // Populate the tags FormArray
    this.tags().clear();
    product.tags.forEach(tag => {
      this.tags().push(this.fb.control(tag));
    });


    // Populate the images FormArray
    this.images().clear();
    product.images.forEach(image => {
      this.images().push(this.fb.control(image));
    });

    // Populate the reviews FormArray
    this.reviews().clear();
    product.reviews.forEach(review => {
      this.reviews().push(this.fb.group({
        rating: [review.rating, Validators.required],
        comment: [review.comment, Validators.required],
        date: [review.date, Validators.required],
        reviewerName: [review.reviewerName, Validators.required],
        reviewerEmail: [review.reviewerEmail, [Validators.required, Validators.email]]
      }));
    });

  }

  tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tags().push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tags().removeAt(index);
  }

  images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addImage(): void {
    this.images().push(this.fb.control(''));
  }

  removeImage(index: number): void {
    this.images().removeAt(index);
  }

  reviews(): FormArray {
    return this.productForm.get('reviews') as FormArray;
  }

  newReview(): FormGroup {
    return this.fb.group({
      rating: [0, Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
      reviewerName: ['', Validators.required],
      reviewerEmail: ['', [Validators.required, Validators.email]]
    });
  }

  addReview() {
    this.reviews().push(this.newReview());
  }

  removeReview(index: number) {
    this.reviews().removeAt(index);
  }

  saveProduct(): void {
    const productData = this.productForm.value;

    if (this.isCreateMode) {
      this.productsService.createProduct(productData).subscribe(
        () => {
          console.log("Successfully created product");
          // this.router.navigate(['/products']);
          this.router.navigate(['/products'], { replaceUrl: true });
        },
        (error) => {
          console.error('Error creating product:', error);
          this.errorModal.handleError(error);
        }
      );
    } else {
      this.productsService.updateProduct(productData).subscribe(
        () => {
          console.log("Successfully updated product");
          // this.router.navigate([`/products/${this.product?.id}/view`]);
          this.router.navigate([`/products/${this.product?.id}/view`], { replaceUrl: true });
        },
        (error) => {
          console.error('Error updating product:', error);
          this.errorModal.handleError(error);
        }
      );
    }
  }

  cancelEdit(): void {
    if (this.isCreateMode) {
      // this.router.navigate(['/products']);
      this.router.navigate(['/products'], { replaceUrl: true });
    } else {
      // this.router.navigate([`/products/${this.product?.id}/view`]);
      this.router.navigate([`/products/${this.product?.id}/view`], { replaceUrl: true });
    }
  }
}
