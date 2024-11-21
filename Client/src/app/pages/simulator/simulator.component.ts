import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { FileHandle } from 'src/models/FileHandle';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  showExcelImage: boolean = false;
  uploadForm!: FormGroup;
  plannedFile: Blob | null = null;
  loading: boolean = false;
  uploadFile: File | null = null;
  error: boolean = false;
  isDownloading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private jobService: JobService,
    private _snackBar: MatSnackBar
  ) {
    this.uploadForm = _formBuilder.group({
      file: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.uploadFile = event.target.files[0];
    if (this.uploadFile) {
      const fileHandle: FileHandle = {
        file: this.uploadFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.uploadFile))
      };
      // Any additional logic for the file handle can be added here.
    }
  }

  sendUploadedFile() {
    this.loading = true;
    this.error = false;
  
    if (this.uploadFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.uploadFile, this.uploadFile.name);
  
      this.jobService.simulateWithExcelFile(formData).subscribe({
        next: (response: Blob) => {
          this.plannedFile = response;
          this.loading = false;
        },
        error: (error: any) => {
          console.error("Error during file processing:", error);
          this.error = true;
          this.loading = false;
          this.openSnackBar('An error occurred. Please try again.');
        }
      });
    } else {
      console.log("No file uploaded");
      this.loading = false;
      this.openSnackBar('Please upload a file first');
    }
  }
  

  openSnackBar(message: string) {
    this._snackBar.open(message, '', { duration: 2000 });
  }

  downloadFile() {
    if (this.plannedFile) {
      this.isDownloading = true;
      fileSaver.saveAs(this.plannedFile, 'Result.xlsx');
      this.isDownloading = false;
    } else {
      this.openSnackBar('No file available for download');
    }
  }
}
