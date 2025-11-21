import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectOwnerResponse } from '../../../models/interfaces';
import { NumberSpacesPipe } from '../../../pipes/number-spaces-pipe-pipe';
import { OwnerTypePipe } from '../../../pipes/owner-type-pipe';
import { PublicService } from '../../../services/public-service';
import { getExtensionFromBlob } from '../../../utilities/utilities';
import { FileViewer } from '../file-viewer/file-viewer';

@Component({
  selector: 'app-owner-details',
  imports: [
    NumberSpacesPipe,
    OwnerTypePipe,
    FileViewer
  ],
  templateUrl: './owner-details.html',
  styleUrl: './owner-details.css',
})
export class OwnerDetails implements OnInit {

  @Input() owner: ProjectOwnerResponse | undefined;

  @Output() closed = new EventEmitter<void>();

  @Output() validatedOwner = new EventEmitter<void>();

  @Output() refusedOwner = new EventEmitter<void>();

  profileImageUrl: string | undefined;
  bankStatementUrl: string | undefined;
  bankStatementFileType: string = "UNK.";
  biometricCardUrl: string | undefined;
  biometricCardFileType: string = "UNK.";
  residenceCertificateUrl: string | undefined;
  residenceCertificateFileType: string = "UNK.";
  associationStatusUrl: string | undefined;
  associationStatusFileType: string = "UNK.";
  rccmUrl: string | undefined;
  rccmFileType: string = "UNK.";

  showFileViewer = false;
  fileToViewUrl = '';
  fileToViewType!: string;

  constructor(
    private publicService: PublicService,
    private cdr: ChangeDetectorRef
  ) {}

  close() {
    this.closed.emit();
  }

  validateOwner() {
    this.validatedOwner.emit();
  }

  refuseOwner() {
    this.refusedOwner.emit();
  }

  ngOnInit(): void {
    if(this.owner?.profilePictureUrl) {
      this.publicService.downloadFile(this.owner?.profilePictureUrl!).subscribe({
        next: (value: Blob) => {
          this.profileImageUrl = URL.createObjectURL(value);
          this.cdr.detectChanges()
        }
      })
    } else if(this.owner?.logoUrl) {
      this.publicService.downloadFile(this.owner?.logoUrl!).subscribe({
        next: (value: Blob) => {
          this.profileImageUrl = URL.createObjectURL(value);
          this.cdr.detectChanges()
        }
      })
    }
    if(this.owner?.bankStatementUrl !== null && this.owner?.bankStatementUrl !== undefined) {
      this.publicService.downloadFile(this.owner?.bankStatementUrl!).subscribe({
        next: (value: Blob) => {
          console.log(value.type)
          this.bankStatementUrl = URL.createObjectURL(value);
          this.bankStatementFileType = getExtensionFromBlob(value);
          this.cdr.detectChanges()
        }
      })
    }
    if(this.owner?.biometricCardUrl !== null && this.owner?.biometricCardUrl !== undefined) {
      this.publicService.downloadFile(this.owner?.biometricCardUrl!).subscribe({
        next: (value: Blob) => {
          console.log(value.type)
          this.biometricCardUrl = URL.createObjectURL(value);
          this.biometricCardFileType = getExtensionFromBlob(value);
          this.cdr.detectChanges()
        }
      })
    }
    if(this.owner?.residenceCertificateUrl !== null && this.owner?.residenceCertificateUrl !== undefined) {
      this.publicService.downloadFile(this.owner?.residenceCertificateUrl!).subscribe({
        next: (value: Blob) => {
          console.log(value.type)
          this.residenceCertificateUrl = URL.createObjectURL(value);
          this.residenceCertificateFileType = getExtensionFromBlob(value);
          this.cdr.detectChanges()
        }
      })
    }
    if(this.owner?.associationStatusUrl !== null && this.owner?.associationStatusUrl !== undefined) {
      this.publicService.downloadFile(this.owner?.associationStatusUrl!).subscribe({
        next: (value: Blob) => {
          console.log(value.type)
          this.associationStatusUrl = URL.createObjectURL(value);
          this.associationStatusFileType = getExtensionFromBlob(value);
          this.cdr.detectChanges()
        }
      })
    }
    if(this.owner?.rccmUrl !== null && this.owner?.rccmUrl !== undefined) {
      this.publicService.downloadFile(this.owner?.rccmUrl!).subscribe({
        next: (value: Blob) => {
          console.log(value.type)
          this.rccmUrl = URL.createObjectURL(value);
          this.rccmFileType = getExtensionFromBlob(value);
          this.cdr.detectChanges()
        }
      })
    }
  }

  showFile(fileUrl: string, type: string) {
    this.showFileViewer = true;
    this.fileToViewUrl = fileUrl;
    this.fileToViewType = type;
    this.cdr.detectChanges()
  }

  hideFile() {
    this.showFileViewer = false;
    this.cdr.detectChanges()
  }
}
