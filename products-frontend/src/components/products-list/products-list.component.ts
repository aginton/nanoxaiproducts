import {Component, Input, OnInit} from '@angular/core';
import { ProductsService, ProductsResponse } from '../../services/products.service';
import {CommonModule} from "@angular/common";
// import {PaginationComponent} from "../pagination/pagination.component";

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],  // Include any necessary imports
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  @Input() searchTerm: string = '';  // Ensure this Input is declared
  products: any[] = [];
  totalProducts: number = 0;
  paginatedProducts: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;


  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // TODO: Change?
  // loadProducts(): void {
  //   this.productsService.getProducts(false).subscribe((response: ProductsResponse) => {
  //     this.products = response.products;
  //     this.totalProducts = response.total;
  //   });
  // }
  loadProducts(): void {
    this.productsService.getProducts(false).subscribe((response: ProductsResponse) => {
      console.log("Fetched results ", response);
      this.products = response.products;
      this.totalProducts = response.total
    });
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }
}
