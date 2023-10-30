import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ResultGridComponent } from './result-grid/result-grid.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    ResultGridComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, MatTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
