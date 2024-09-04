import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from "@angular/common";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import {SortDropdownComponent} from "../sort-dropdown/sort-dropdown.component";
import {Router} from "@angular/router";
import {SearchProductsRequest} from "../../model/search-product-request.model";
import {ProductsResponse} from "../../model/products-response.model";

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule, SortDropdownComponent],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  products: any[] = [];
  selectedProductIds: number[] = [];
  totalProducts: number = 0;
  pageSize: number | 'All' = 20; // Default page size
  pageSizeOptions = [20, 50, 100, 'All']; // Options for page size
  currentPage: number = 1;
  sortField: string | undefined = undefined;
  sortOrder: 'ASC' | 'DESC' | undefined = undefined;

  constructor(private productsService: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.searchProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      console.log("onChange detected for searchTerm ", this.searchTerm);
      this.currentPage = 1; // Reset to the first page whenever search term changes
      this.searchProducts();
    }
  }


  searchProducts(): void {
    const request: SearchProductsRequest = {
      text: this.searchTerm,
      page: this.currentPage - 1, // Backend expects 0-based index
      size: this.pageSize !== 'All' ? this.pageSize : undefined,
      allItems: this.pageSize === 'All',
      ...(this.sortField ? { sortField: this.sortField, order: this.sortOrder } : {}),
    };


    this.productsService.searchProducts(request).subscribe((response: ProductsResponse) => {
      console.log("Fetched results ", response);
      this.products = response.products;
      this.totalProducts = response.total;
    });
  }

  viewProduct(productId: number): void {
    console.log("Going to view product with id: ", productId);
    this.router.navigate([`/products/${productId}/view`]);
  }

  createProduct(): void {
    this.router.navigate(['/products/create']);
  }



  deleteProducts() {
    if (this.selectedProductIds.length > 0) {
      this.productsService.deleteProducts(this.selectedProductIds).subscribe(
        () => {
          console.log('Products deleted successfully');
          this.selectedProductIds = [];  // Reset the selectedProductIds array
          this.searchProducts();  // Re-fetch the product list to refresh the page
        },
        (error) => {
          console.error('Error deleting products:', error);
        }
      );
    } else {
      console.log('No products selected for deletion');
    }
  }


  toggleSelection(productId: number) {
    const index = this.selectedProductIds.indexOf(productId);
    if (index > -1) {
      this.selectedProductIds.splice(index, 1);
    } else {
      this.selectedProductIds.push(productId);
    }
  }

  isSelected(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedProductIds = this.products.map(product => product.id);
    } else {
      this.selectedProductIds = [];
    }
  }


  onPageChange(page: number): void {
    this.currentPage = page; // Directly assign the page number
    console.log("Page changed to ", page);
    this.searchProducts();  // Trigger the search when the page changes
  }

  onPageSizeChange(size: any): void {
    this.pageSize = size === 'All' ? this.totalProducts : size;
    this.currentPage = 1; // Reset to the first page whenever page size changes
    console.log("Page size changed to ", size);
    this.searchProducts();  // Trigger the search when the page size changes
  }

  onSortChange(sortOption: { field: string, direction: 'ASC' | 'DESC' }): void {
    if (sortOption.field === 'featured') {
      this.sortField = undefined; // Set to undefined
      this.sortOrder = undefined; // Set to undefined
    } else {
      this.sortField = sortOption.field;
      this.sortOrder = sortOption.direction;
    }

    console.log('Selected Sort Option:', this.sortField, this.sortOrder);
    this.currentPage = 1;  // Reset to the first page
    this.searchProducts();  // Trigger the search with the new sort option
  }
}
