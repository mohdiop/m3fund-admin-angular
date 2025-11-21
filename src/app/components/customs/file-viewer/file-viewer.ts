import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-file-viewer',
  imports: [
    PdfViewerModule
  ],
  templateUrl: './file-viewer.html',
  styleUrl: './file-viewer.css',
})
export class FileViewer {
  @Input() url!: string;
  @Input() type!: string;
  @Output() closed = new EventEmitter<void>();

  isPdf(): boolean {
    return this.type === "PDF";
  }

  close() {
    this.closed.emit();
  }
}
