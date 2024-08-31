import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {ProductsListComponent} from "../products-list/products-list.component";

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductsListComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent {

  searchTerm: string = '';

  onSearch(term: string): void {
    this.searchTerm = term;
  }
}

