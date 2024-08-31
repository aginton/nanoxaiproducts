import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import {ProductsPageComponent} from "../components/products-page/products-page.component";
import { ErrorDisplayComponent } from '../components/error-display/error-display.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'products', component: ProductsPageComponent }, // Route for products list
  { path: 'error', component: ErrorDisplayComponent }, // Route for error display
  { path: '**', redirectTo: '' } // Wildcard route redirects to HomeComponent
];
