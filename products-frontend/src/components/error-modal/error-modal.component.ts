import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  @Input() errors: string | string[] = '';
  @ViewChild('errorModal') errorModalTemplate!: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  openErrorModal() {
    this.modalService.open(this.errorModalTemplate);
  }

  handleError(errorResponse: any) {
    // if (Array.isArray(errorResponse.error)) {
    //   this.errors = errorResponse.error;
    // } else {
    //   this.errors = errorResponse.error || 'An unexpected error occurred.';
    // }
    this.errors = errorResponse.error || 'An unexpected error occurred.';
    this.openErrorModal();
  }

  protected readonly Array = Array;
}
