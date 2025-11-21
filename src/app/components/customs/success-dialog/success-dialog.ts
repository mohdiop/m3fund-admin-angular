import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-dialog',
  imports: [],
  templateUrl: './success-dialog.html',
  styleUrl: './success-dialog.css',
})
export class SuccessDialog {

  
  @Input() show = false;
  @Input() message = '';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
