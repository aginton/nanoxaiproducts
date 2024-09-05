import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search term when search button is clicked', () => {
    spyOn(component.searchEvent, 'emit');

    component.searchTerm = 'test search term';  // Set a search term
    const button = fixture.nativeElement.querySelector('button');
    button.click();  // Simulate button click

    expect(component.searchEvent.emit).toHaveBeenCalledWith('test search term');
  });

  it('should emit search term when "Enter" key is pressed', () => {
    spyOn(component.searchEvent, 'emit');

    component.searchTerm = 'enter key search';  // Set a search term
    const input = fixture.nativeElement.querySelector('input');

    const event = new KeyboardEvent('keydown', {
      key: 'Enter'
    });
    input.dispatchEvent(event);  // Simulate pressing Enter

    expect(component.searchEvent.emit).toHaveBeenCalledWith('enter key search');
  });

  it('should bind search term to input field using ngModel', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'new search term';
    input.dispatchEvent(new Event('input'));  // Simulate input event

    expect(component.searchTerm).toBe('new search term');
  });

  it('should have an empty search term on initialization', () => {
    expect(component.searchTerm).toBe('');
  });

});
