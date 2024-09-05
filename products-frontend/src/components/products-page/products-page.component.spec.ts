import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPageComponent } from './products-page.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {of} from "rxjs";
import {ProductsService} from "../../services/products.service";

describe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let fixture: ComponentFixture<ProductsPageComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SearchBarComponent,
        ProductsListComponent,
        NoopAnimationsModule,  // Useful for disabling animations in tests
        ProductsPageComponent,  // Import the standalone component
        HttpClientTestingModule,
        NgbModule
      ]
    }).compileComponents();

    // Use runInInjectionContext to initialize component and fixture
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(ProductsPageComponent);
      component = fixture.componentInstance;
    });


    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchTerm when onSearch is called', () => {
    const searchTerm = 'test search';
    component.onSearch(searchTerm);
    expect(component.searchTerm).toBe(searchTerm);
  });

  it('should pass searchTerm to ProductsListComponent', () => {
    const searchTerm = 'another search';
    component.searchTerm = searchTerm;
    fixture.detectChanges();

    const productsListComponent = fixture.debugElement.query(By.directive(ProductsListComponent)).componentInstance;
    expect(productsListComponent.searchTerm).toBe(searchTerm);
  });

  it('should update searchTerm when searchEvent is emitted from SearchBarComponent', () => {
    const searchTerm = 'new search term';
    const searchBarComponent = fixture.debugElement.query(By.directive(SearchBarComponent));

    searchBarComponent.triggerEventHandler('searchEvent', searchTerm);
    fixture.detectChanges();

    expect(component.searchTerm).toBe(searchTerm);
  });
});
