import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HealthService} from "../services/healthservice";
import {CommonModule} from "@angular/common";
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'products-frontend';
  pingResponse: string = '';
  isBackendAlive: boolean | null = null;

  constructor(private healthService: HealthService, private router: Router) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth(): void {
    this.healthService.ping().subscribe(
      response => {
        this.pingResponse = response;
        this.isBackendAlive = true;
        this.router.navigate(['/products']);  // Navigate to /products
      },
      error => {
        console.error('Error:', error);
        this.pingResponse = 'Backend is not available';
        this.isBackendAlive = false;
      }
    );
  }
}
