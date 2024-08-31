import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {NgbPagination, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgbPagination, FormsModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  @Input() totalItems: number = 0;  // Total number of items
  @Input() itemsPerPage: number = 10;  // Items per page
  @Input() currentPage: number = 1;  // Current page
  @Output() pageChanged = new EventEmitter<number>();  // Emits when the page changes

  totalPages: number = 0;  // Total pages

  ngOnInit(): void {
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1;  // Reset to first page
    this.calculateTotalPages();
    this.pageChanged.emit(this.currentPage);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.pageChanged.emit(this.currentPage);
  }
}

