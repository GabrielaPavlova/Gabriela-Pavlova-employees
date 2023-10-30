import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileSelected.emit(file);
  }
}
