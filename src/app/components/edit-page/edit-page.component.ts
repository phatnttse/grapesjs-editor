import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GrapesJsService } from '../../services/grapesjs.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import grapesjs from 'grapesjs';
import 'grapesjs-tailwind';
import { ToastrService } from 'ngx-toastr';
import { GrapesjsConfig } from '../../configurations/grapesjs.config';
import { HttpErrorResponse } from '@angular/common/http';
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
import { MatDialog } from '@angular/material/dialog';
import {
  BusinessCard,
  UpdateBusinessCardDto,
} from '../../models/business-card.model';
import { MatSelectModule } from '@angular/material/select';

interface Position {
  value: string;
}

@Component({
  selector: 'app-edit-page',
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
    MatSelectModule,
  ],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPageComponent implements OnInit {
  editor: any = null; // Editor GrapesJS
  valueBusinessCardId: string | null = null; // Id trang
  formBusinessCard: FormGroup; // Form tạo trang
  isOpenWidget: boolean = false; // Trạng thái của widget
  listUploadedImages: string[] = []; // Danh sách ảnh đã tải lên
  valueThumbnail: string = ''; // Ảnh bìa
  valueContent: string = ''; // Nội dung trang

  positions: Position[] = [
    { value: 'CEO' },
    { value: 'COO' },
    { value: 'Backend Developer' },
    { value: 'Frontend Developer' },
    { value: 'Department Head' },
  ];

  constructor(
    private grapesjsService: GrapesJsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.formBusinessCard = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      position: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit(): void {
    this.editor = GrapesjsConfig(this.grapesjsService, this.dialog);

    this.route.paramMap.subscribe((params) => {
      this.valueBusinessCardId = params.get('id');
      if (this.valueBusinessCardId) {
        this.getBusinessCard(this.valueBusinessCardId);
      }
    });
  }

  onSubmit(): void {
    if (this.formBusinessCard.invalid) {
      this.formBusinessCard.markAllAsTouched();
      return;
    }
    const htmlData = this.editor.getHtml();
    const cssData = this.editor.getCss();
    if (!htmlData.includes('<head>')) {
      this.valueContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.formBusinessCard.value.title || 'Page Title'}</title>
          <script src="https://cdn.tailwindcss.com" ></script>
          <style>
            ${cssData}
          </style>
        </head>
          ${htmlData}
        </html>
      `;
    }
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
    if (this.valueThumbnail === '') {
      this.toastr.warning('Vui lòng tải ảnh bìa.', 'Có lỗi xảy ra', {
        timeOut: 3000,
        progressBar: true,
      });
      return;
    }
    const businessCard: UpdateBusinessCardDto = {
      id: this.valueBusinessCardId!,
      name: this.formBusinessCard.value.name!,
      phone: this.formBusinessCard.value.phone,
      position: this.formBusinessCard.value.position,
      content: this.valueContent,
      thumbnail: this.valueThumbnail,
    };
    this.grapesjsService.updateBusinessCard(businessCard).subscribe({
      next: (response: BusinessCard) => {
        this.toastr.success('Success', 'Business Card updated successfully', {
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

  getBusinessCard(pageId: string) {
    this.grapesjsService.getBusinessCardById(pageId).subscribe({
      next: (response: BusinessCard) => {
        this.formBusinessCard.patchValue({
          title: response.name,
          position: response.position,
          phone: response.phone,
        });
        this.valueThumbnail = response.thumbnail;
        this.grapesjsService.getHtmlFromUrl(response.src).subscribe({
          next: (htmlContent: string) => {
            console.log('HTML content:', htmlContent);
            this.editor.setComponents(htmlContent);
          },
          error: (error: HttpErrorResponse) => {
            console.log('Error fetching HTML content:', error);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(`${error.error.message}`, 'Error');
        console.log(error);
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
