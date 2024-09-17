import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GrapesJsService } from '../../../services/grapesjs.service';
import { CLOUDINARY } from '../../../environments/environment.development';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss',
})
export class VideoUploadComponent {
  formVideoUpload: any = null; // Form tải video lên
  isOpenWidget: any = false; // Trạng thái của widget
  listUploadedImages: any = []; // Danh sách ảnh đã tải lên
  posterUrl: any = ''; // Poster của video
  valueVideo: any = null; // Video
  videoUrl: any = null; // URL của video

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private grapesjsService: GrapesJsService
  ) {
    this.formVideoUpload = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // Hàm tải video lên
  onSubmit() {
    if (this.formVideoUpload.invalid) {
      this.formVideoUpload.markAllAsTouched();
      return;
    }
    if (!this.valueVideo) {
      this.toastr.error('Please select a video to upload');
      return;
    }
    if (!this.posterUrl) {
      this.toastr.error('Please upload a poster for the video');
      return;
    }
    this.grapesjsService
      .Video_Upload(
        this.valueVideo,
        this.formVideoUpload.value.title,
        this.posterUrl
      )
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Video uploaded successfully', 'Success', {
            progressBar: true,
          });
          this.formVideoUpload.reset();
          this.listUploadedImages = [];
          this.posterUrl = '';
          this.valueVideo = null;
          this.videoUrl = '';
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(`${error.error.message}`, 'Error');
          console.log(error);
        },
      });
  }

  // Hàm chọn video
  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxFileSize = 30 * 1024 * 1024;
      if (file.size > maxFileSize) {
        this.toastr.warning(
          'Video size exceeds the 30MB limit. Please choose a smaller video.'
        );
        return;
      }
      this.valueVideo = file;
      this.videoUrl = URL.createObjectURL(file);
    }
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isOpenWidget = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_451/');
      this.listUploadedImages.push(previewUrl);
      this.posterUrl = secureUrl;
    }
    if (error) {
      this.isOpenWidget = false;
    }
  };

  uploadWidget = (): void => {
    this.isOpenWidget = true;
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUDINARY.cloudName,
        uploadPreset: CLOUDINARY.uploadPreset,
        sources: ['local', 'url', 'camera', 'dropbox'], // Thêm các nguồn muốn hỗ trợ
        tags: ['myphotoalbum-grapesjs'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
        maxFileSize: 2 * 1024 * 1024,
        multiple: false,
      },
      this.processResults
    );
  };
}
