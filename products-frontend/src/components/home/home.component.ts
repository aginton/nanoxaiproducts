import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HealthService } from '../../services/healthservice';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isBackendAlive: boolean | null = null;

  constructor(private healthService: HealthService, private router: Router) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth(): void {
    this.healthService.ping().subscribe(
      response => {
        this.isBackendAlive = true;
        this.router.navigate(['/products']);  // Navigate to ProductsListComponent
      },
      error => {
        this.isBackendAlive = false;
        this.router.navigate(['/error']);  // Navigate to ErrorDisplayComponent
      }
    );
  }
}

