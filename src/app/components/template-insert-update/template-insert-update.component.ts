import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GrapesJsService } from '../../services/grapesjs.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { GrapesjsConfig } from '../../configurations/grapesjs.config';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NameCardTemplateService } from '../../services/name-card-template.service';
import { InsertUpdateNameCardTemplateDto } from '../../models/name-card-template.model';

@Component({
  selector: 'app-template-insert-update',
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
    MatStepperModule,
    NgxDropzoneModule,
  ],
  templateUrl: './template-insert-update.component.html',
  styleUrl: './template-insert-update.component.scss',
})
export class TemplateInsertUpdateComponent {
  editor: any = null; // Editor GrapesJS
  valueBusinessCardId: any = null; // Id card
  formNameCard: FormGroup; // Form tạo card
  valueThumbnail: any = ''; // Ảnh bìa
  valueContent: any = ''; // Nội dung card
  valueFile: any = null; // Giá trị file
  scriptsData: any = ''; // Dữ liệu script

  constructor(
    private grapesjsService: GrapesJsService,
    private nameCardTemplateService: NameCardTemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    this.formNameCard = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    //Chuyển hướng về đầu trang
    window.scrollTo(0, 0);

    this.editor = GrapesjsConfig(this.grapesjsService, this.dialog);

    this.route.paramMap.subscribe((params) => {
      this.valueBusinessCardId = params.get('id');
      if (this.valueBusinessCardId !== null) {
        this.NameCardTemplate_GetById(this.valueBusinessCardId);
      }
    });

    this.loadScripts();
  }

  // Hàm tạo hoặc cập nhật name card template
  btn_NameCardTemplate_InsertUpdate() {
    if (this.formNameCard.invalid) {
      this.formNameCard.markAllAsTouched();
      return;
    }
    const htmlData = this.editor.getHtml();
    const cssData = this.editor.getCss();

    // Tạo DOM từ htmlData để dễ dàng thao tác
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlData, 'text/html');

    // Kiểm tra xem có thẻ <script> không
    let scriptTag = doc.querySelector('script');

    if (scriptTag) {
      // Nếu đã có thẻ <script>, thêm nội dung jsData vào trong
      scriptTag.innerHTML += this.scriptsData;
    } else {
      // Nếu chưa có thẻ <script>, tạo một thẻ mới và thêm jsData vào
      let newScriptTag = doc.createElement('script');
      newScriptTag.innerHTML = this.scriptsData;
      doc.body.appendChild(newScriptTag);
    }

    // Lấy lại HTML đã chỉnh sửa
    const updatedHtml = doc.documentElement.outerHTML;
    this.valueContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${this.formNameCard.value.name || 'F2Tech'}</title>
      <style>
      ${cssData}
      </style>
    </head>
      ${updatedHtml}
    </html>
  `;
    if (htmlData === '<body></body>') {
      this.toastr.warning(
        'Vui lòng thêm nội dung cho trang.',
        'Có lỗi xảy ra',
        {
          progressBar: true,
        }
      );
      return;
    }
    if (this.valueThumbnail === '') {
      this.toastr.warning('Vui lòng tải ảnh bìa.', 'Có lỗi xảy ra', {
        progressBar: true,
      });
      return;
    }
    const nameCard: InsertUpdateNameCardTemplateDto = {
      id: this.valueBusinessCardId ?? null,
      name: this.formNameCard.value.name,
      content: this.valueContent,
      thumbnail: this.valueThumbnail,
    };
    this.nameCardTemplateService
      .NameCardTemplate_InsertUpdate(nameCard)
      .subscribe({
        next: (response: any) => {
          if (response.resultCode === 'OK') {
            if (this.valueBusinessCardId === null) {
              this.toastr.success(
                'Success',
                'Business Card created successfully',
                {
                  progressBar: true,
                }
              );
              this.router.navigate(['/templates']);
            } else {
              this.toastr.success(
                'Success',
                'Business Card updated successfully',
                {
                  progressBar: true,
                }
              );
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.toastr.error('Error', 'Failed to create page', {
            progressBar: true,
          });
        },
      });
  }

  // Hàm lấy thông tin name card template theo id
  NameCardTemplate_GetById(cardId: string) {
    this.nameCardTemplateService.NameCardTemplate_GetById(cardId).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          this.formNameCard.patchValue({
            name: response.result.name,
          });
          this.valueThumbnail = response.result.thumbnail;
          this.grapesjsService
            .Content_GetFromUrl(response.result.url)
            .subscribe({
              next: (htmlContent: any) => {
                this.editor.setComponents(htmlContent);
              },
              error: (error: HttpErrorResponse) => {
                console.log('Error fetching HTML content:', error);
              },
            });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(`${error.error.message}`, 'Error');
        console.log(error);
      },
    });
  }

  // Hàm tải ảnh lên
  Image_Upload(file: any): void {
    this.grapesjsService.Image_Upload(file).subscribe({
      next: (response: any) => {
        this.valueThumbnail = response.src;
        this.cdRef.detectChanges(); // Make sure Angular detects changes after upload
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error uploading file:', error.error.message);
        this.toastr.error('Failed to upload file', 'Error');
      },
    });
  }

  // Hàm chọn ảnh
  onSelectFile(event: any) {
    const selectedFile = event.addedFiles[0];

    if (selectedFile) {
      this.valueFile = selectedFile;
      this.Image_Upload(selectedFile);
    }
  }

  // Hàm xử lý xoá ảnh
  onRemoveFile(event: any) {
    if (this.valueFile === event) {
      this.valueFile = null;
    }
  }

  // Hàm tải scripts để thêm vào template
  loadScripts() {
    this.grapesjsService
      .Content_GetFromUrl('assets/grapesjs/blocks/js/main.js')
      .subscribe({
        next: (response: any) => {
          this.scriptsData = response;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching scripts:', error);
        },
      });
  }
}
