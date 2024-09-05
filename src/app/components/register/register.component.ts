import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NameCardTemplateService } from '../../services/name-card-template.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxDropzoneModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  formRegister: any = null; // Form đăng ký
  listNameCardTemplates: any = []; // Danh sách template card
  valueFileAvatar: any = null; // Giá trị file avatar
  valueFileCoverPhoto: any = null; // Giá trị file ảnh bìa

  constructor(
    private formBuilder: FormBuilder,
    private nameCardTemplateService: NameCardTemplateService
  ) {
    this.formRegister = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: [''],
      position: [''],
      companyAddress: [''],
      websiteUrl: [''],
    });
  }

  ngOnInit(): void {
    this.getNameCardTemplates();
  }

  getNameCardTemplates() {
    this.nameCardTemplateService.getNameCardTemplates().subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          this.listNameCardTemplates = response.result;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  createUserNameCard() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }
  }

  onSelectFile(event: any, status: number) {
    if (status === 0) {
      const selectedFile = event.addedFiles[0];

      if (selectedFile) {
        this.valueFileAvatar = selectedFile;
        this.uploadFileToServer(selectedFile);
      }
    } else if (status === 1) {
      const selectedFile = event.addedFiles[0];

      if (selectedFile) {
        this.valueFileCoverPhoto = selectedFile;
        this.uploadFileToServer(selectedFile);
      }
    }
  }

  onRemoveFile(event: any, status: number) {
    if (this.valueFileAvatar === event && status === 0) {
      this.valueFileAvatar = null;
    } else if (this.valueFileCoverPhoto === event && status === 1) {
      this.valueFileCoverPhoto = null;
    }
  }

  uploadFileToServer(file: any): void {
    // this.grapesjsService.uploadFile(file).subscribe({
    //   next: (response: any) => {
    //     this.valueThumbnail = response.src;
    //     this.cdRef.detectChanges(); // Make sure Angular detects changes after upload
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error('Error uploading file:', error.error.message);
    //     this.toastr.error('Failed to upload file', 'Error');
    //   },
    // });
  }
}
