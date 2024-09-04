import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import {ProductsPageComponent} from "../components/products-page/products-page.component";
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import {ProductViewComponent} from "../components/product-view/product-view.component";
import {ProductEditComponent} from "../components/product-edit/product-edit.component";

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'products', component: ProductsPageComponent }, // Route for products list
  { path: 'products/:id/view', component: ProductViewComponent },
  { path: 'products/create', component: ProductEditComponent },
  { path: 'products/:id/edit', component: ProductEditComponent },
  { path: 'error', component: ErrorModalComponent }, // Route for error display
  { path: '**', redirectTo: '' } // Wildcard route redirects to HomeComponent
];
