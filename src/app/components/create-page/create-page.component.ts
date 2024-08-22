import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import grapesjs from 'grapesjs';
import 'grapesjs-tailwind';
import { GrapesJsService } from '../../services/grapesjs.service';
import { Router, RouterModule } from '@angular/router';
import { CreatePageDto, Page } from '../../models/page.model';
import { GrapesjsConfig } from '../../configurations/grapesjs.config';
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
import { CLOUDINARY } from '../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-page',
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
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss',
})
export class CreatePageComponent implements OnInit {
  editor: any = null; // Editor GrapesJS
  formPage: FormGroup; // Form tạo trang
  isOpenWidget: boolean = false; // Trạng thái của widget
  listUploadedImages: string[] = []; // Danh sách ảnh đã tải lên
  valueContent: string = ''; // Nội dung trang
  valueThumbnail: string = ''; // Ảnh bìa

  constructor(
    private grapesjsService: GrapesJsService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.formPage = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.editor = GrapesjsConfig(this.grapesjsService, this.dialog);
  }
  onSubmit() {
    if (this.formPage.invalid) {
      this.formPage.markAllAsTouched();
      return;
    }
    const htmlData = this.editor.getHtml();
    const cssData = this.editor.getCss();
    this.valueContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.formPage.value.title || 'Page Title'}</title>
          <script src="https://cdn.tailwindcss.com" ></script>
        </head>
        <style>
          ${cssData}
        </style>
        <body>
          ${htmlData}
        </body>
        </html>
      `;
    if (htmlData === '<body></body>') {
      this.toastr.warning(
        'Vui lòng thêm nội dung cho trang.',
        'Có lỗi xảy ra',
        {
          timeOut: 3000,
          progressBar: true,
        }
      );
      return;
    }
    if (this.listUploadedImages.length === 0) {
      this.toastr.warning('Vui lòng tải ảnh bìa.', 'Có lỗi xảy ra', {
        timeOut: 3000,
        progressBar: true,
      });
      return;
    }
    const page: CreatePageDto = {
      title: this.formPage.value.title,
      content: this.valueContent,
      thumbnail: this.listUploadedImages[0],
    };
    this.grapesjsService.createPage(page).subscribe({
      next: (response: Page) => {
        this.formPage.reset();
        this.listUploadedImages = [];
        this.toastr.success('Success', 'Page created successfully', {
          timeOut: 3000,
          progressBar: true,
        });
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error('Error', 'Failed to create page', {
          timeOut: 3000,
          progressBar: true,
        });
      },
    });
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isOpenWidget = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_451/');
      this.listUploadedImages.push(previewUrl);
      this.listUploadedImages[0] = secureUrl;
      this.valueThumbnail = secureUrl;
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
        sources: ['local', 'url', 'camera', 'dropbox'], // Thêm các nguồn bạn muốn hỗ trợ
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
