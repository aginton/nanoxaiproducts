import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";

interface SortOption {
  label: string;
  value: { field: string, direction: 'ASC' | 'DESC' };
}

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  standalone: true,
  imports: [FormsModule, NgbDropdownModule, CommonModule]
})
export class SortDropdownComponent implements OnInit{


  ngOnInit() {

  }

  sortOptions: SortOption[] = [
    { label: 'Featured', value: { field: 'featured', direction: 'ASC' } },
    { label: 'Title: Asc', value: { field: 'title', direction: 'ASC' } },
    { label: 'Title: Desc', value: { field: 'title', direction: 'DESC' } },
    { label: 'Price: Asc', value: { field: 'price', direction: 'ASC' } },
    { label: 'Price: Desc', value: { field: 'price', direction: 'DESC' } },
    { label: 'Rating: Asc', value: { field: 'rating', direction: 'ASC' } },
    { label: 'Rating: Desc', value: { field: 'rating', direction: 'DESC' } }
  ];

  selectedSortOption: SortOption = this.sortOptions[0];

  constructor() {
    // Log the sortOptions to the console for debugging
    console.log('Sort Options:', this.sortOptions);
  }

  @Output() sortChanged = new EventEmitter<{ field: string, direction: 'ASC' | 'DESC' }>();


  onSortChange(option: SortOption): void {
    this.selectedSortOption = option; // Update the selectedSortOption
    console.log('Sort option selected:', this.selectedSortOption);
    this.sortChanged.emit(this.selectedSortOption.value);
  }

}

