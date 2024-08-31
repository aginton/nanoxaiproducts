import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductsService, ProductsResponse, SearchProductsRequest} from '../../services/products.service';
import {CommonModule} from "@angular/common";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule],  // Include any necessary imports
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';  // Ensure this Input is declared
  products: any[] = [];
  totalProducts: number = 0;
  pageSize: number | 'All' = 20; // Default page size
  pageSizeOptions = [20, 50, 100, 'All']; // Options for page size
  currentPage: number = 0;


  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.searchProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      console.log("onChange detected for searchTerm ", this.searchTerm);
      this.currentPage = 0; // Reset to the first page whenever search term changes
      this.searchProducts();
    }
  }

  searchProducts(): void {
    const request: SearchProductsRequest = {
      text: this.searchTerm,
      order: 'ASC', // Default sort order
      page: this.currentPage,
      size: this.pageSize !== 'All' ? this.pageSize : undefined,
      allItems: this.pageSize === 'All'
    };

    this.productsService.searchProducts(request).subscribe((response: ProductsResponse) => {
      console.log("Fetched results ", response);
      this.products = response.products;
      this.totalProducts = response.total;
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page - 1; // Adjust for zero-based page index
    console.log("Page changed to ", page)
    this.searchProducts();  // Trigger the search when the page changes
  }

  onPageSizeChange(size: any): void {
    this.pageSize = size === 'All' ? this.totalProducts : size;
    this.currentPage = 0; // Reset to the first page whenever page size changes
    console.log("Page size changed to ", size)
    this.searchProducts();  // Trigger the search when the page changes
  }

  // Handle the search event
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;  // Update the search term
    this.currentPage = 0;  // Reset to the first page
    this.searchProducts();  // Trigger a new search
  }

}
