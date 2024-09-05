import { ChangeDetectorRef, Component } from '@angular/core';
import { CLOUDINARY } from '../../environments/environment.development';
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
import {
  CreateNameCardTemplateDto,
  UpdateNameCardTemplateDto,
} from '../../models/name-card-template.model';
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

@Component({
  selector: 'app-inset-update-page',
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
  templateUrl: './inset-update-page.component.html',
  styleUrl: './inset-update-page.component.scss',
})
export class InsetUpdatePageComponent {
  editor: any = null; // Editor GrapesJS
  valueBusinessCardId: any = null; // Id card
  formNameCard: FormGroup; // Form tạo card
  valueThumbnail: any = ''; // Ảnh bìa
  valueContent: any = ''; // Nội dung card
  valueFile: any = null; // Giá trị file

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
      if (this.valueBusinessCardId !== 'new') {
        this.getNameCard(this.valueBusinessCardId);
      }
    });
  }

  onSelectFile(event: any) {
    const selectedFile = event.addedFiles[0];

    if (selectedFile) {
      this.valueFile = selectedFile;
      this.uploadFileToServer(selectedFile);
    }
  }

  onRemoveFile(event: any) {
    if (this.valueFile === event) {
      this.valueFile = null;
    }
  }

  uploadFileToServer(file: any): void {
    this.grapesjsService.uploadFile(file).subscribe({
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

  onSaveChanges(): void {
    if (this.formNameCard.invalid) {
      this.formNameCard.markAllAsTouched();
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
          <title>${this.formNameCard.value.name || 'F2Tech'}</title>
          <style>
            ${cssData}
          </style>
        </head>
          ${htmlData}
          <script src="https://localhost:7191/js/main.js"></script>
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
    const nameCard: UpdateNameCardTemplateDto = {
      id: this.valueBusinessCardId!,
      name: this.formNameCard.value.name,
      content: this.valueContent,
      thumbnail: this.valueThumbnail,
    };
    this.nameCardTemplateService.updateNameCardTemplate(nameCard).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          this.toastr.success('Success', 'Business Card updated successfully', {
            progressBar: true,
          });
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

  onCreateNewNameCard() {
    if (this.formNameCard.invalid) {
      this.formNameCard.markAllAsTouched();
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
          <title>${this.formNameCard.value.name || 'F2Tech'}</title>
          <style>
          ${cssData}
          </style>
        </head>
          ${htmlData}
         <script src="https://localhost:7191/js/main.js"></script>
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
    const nameCardTemplate: CreateNameCardTemplateDto = {
      name: this.formNameCard.value.name,
      content: this.valueContent,
      thumbnail: this.valueThumbnail,
    };
    this.nameCardTemplateService
      .createNameCardTemplate(nameCardTemplate)
      .subscribe({
        next: (response: any) => {
          if (response.resultCode === 'OK') {
            this.formNameCard.reset();
            this.valueThumbnail = '';
            this.router.navigate(['/']);
            this.toastr.success('Success', 'Page created successfully', {
              progressBar: true,
            });
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

  getNameCard(cardId: string) {
    this.nameCardTemplateService.getNameCardTemplateById(cardId).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          this.formNameCard.patchValue({
            name: response.result.name,
          });
          this.valueThumbnail = response.result.thumbnail;
          this.grapesjsService
            .getContentFromUrl(response.result.url)
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
}
