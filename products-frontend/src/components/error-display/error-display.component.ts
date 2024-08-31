import { Component } from '@angular/core';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.css'
})
export class ErrorDisplayComponent {
  errorMessage: string = 'There was an error connecting to the backend.';
}

