import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortDropdownComponent } from './sort-dropdown.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {By} from "@angular/platform-browser";

describe('SortDropdownComponent', () => {
  let component: SortDropdownComponent;
  let fixture: ComponentFixture<SortDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SortDropdownComponent,  // Import the standalone component
        NgbDropdownModule,
        CommonModule,
        FormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SortDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the default sort option', () => {
    expect(component.selectedSortOption.label).toBe('Featured');
  });

  it('should update selectedSortOption and emit event when a sort option is selected', () => {
    spyOn(component.sortChanged, 'emit');

    const newSortOption = component.sortOptions[1];  // Select "Title: Asc"
    component.onSortChange(newSortOption);

    expect(component.selectedSortOption).toEqual(newSortOption);
    expect(component.sortChanged.emit).toHaveBeenCalledWith(newSortOption.value);
  });

  it('should display the correct number of sort options', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[ngbDropdownItem]'));
    expect(buttons.length).toBe(component.sortOptions.length);
  });

  it('should update the button label when a sort option is selected', () => {
    const newSortOption = component.sortOptions[2];  // Select "Title: Desc"
    component.onSortChange(newSortOption);

    fixture.detectChanges();  // Trigger change detection

    const buttonLabel = fixture.debugElement.query(By.css('button[ngbDropdownToggle]')).nativeElement.textContent;
    expect(buttonLabel.trim()).toBe(newSortOption.label);
  });
});
