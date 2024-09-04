import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import {ProductDetails} from "../../model/product-details.model";


@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  product: ProductDetails | null = null;  // Use the Product interface

  productId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchProduct();
  }

  fetchProduct(): void {
    if (this.productId){
      this.productsService.getProduct(this.productId).subscribe((product) => {
        this.product = product;
        console.log("Fetched product: ", this.product);
      });
    }
  }

  editProduct(): void {
    this.router.navigate([`/products/${this.productId}/edit`]);
  }

  deleteProduct(): void {
    // Handle deletion logic here
    if (this.productId){
      this.productsService.deleteProduct(this.productId).subscribe(
        () => {
          console.log("Deleted product: ", this.product);
          this.router.navigate([`/products`]);
        },
        (error) => {
          console.error('Error Deleting product with productId:', this.productId, error);
        });
    }
  }
}
