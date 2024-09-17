import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NameCardTemplateService } from '../../services/name-card-template.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GrapesJsService } from '../../services/grapesjs.service';
import { ToastrService } from 'ngx-toastr';
import { CreateUserNameCard } from '../../models/user-name-card.model';
import { UserNameCardService } from '../../services/user-name-card.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-name-card-insert-update',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxDropzoneModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './name-card-insert-update.component.html',
  styleUrl: './name-card-insert-update.component.scss',
})
export class NameCardInsertUpdateComponent implements OnInit {
  formRegister: any = null; // Form đăng ký
  listNameCardTemplates: any = []; // Danh sách template card
  valueFileAvatar: any = null; // Giá trị file avatar
  valueFileCoverPhoto: any = null; // Giá trị file ảnh bìa
  valueAvatar: any = null; // Giá trị avatar
  valueCoverPhoto: any = null; // Giá trị ảnh bìa
  valueUserNameCardSlug: any = ''; // Giá trị slug name card
  valueTemplate: any = null; // Giá trị template
  safeUrl: any | null = null;
  valueUserNameCard: any = null; // Giá trị name card

  constructor(
    private formBuilder: FormBuilder,
    private nameCardTemplateService: NameCardTemplateService,
    private userNameCardService: UserNameCardService,
    private grapesjsService: GrapesJsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.formRegister = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      companyAddress: ['', Validators.required],
      websiteUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.valueUserNameCardSlug = params.get('slug'); // Lấy slug từ URL
      if (this.valueUserNameCardSlug) {
        this.UserNameCard_GetBySlug(this.valueUserNameCardSlug);
      } else {
        this.NameCardTemplate_GetAll();
      }
    });
  }

  // Hàm lấy tất cả template card
  NameCardTemplate_GetAll() {
    this.nameCardTemplateService.NameCardTemplate_GetAll().subscribe({
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

  // Hàm thêm hoặc câp nhật name card
  btn_UserNameCard_InsertUpdate(nameCardId: string) {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }
    const createUserNameCard: CreateUserNameCard = {
      id: this.valueUserNameCard?.id,
      nameCardId: nameCardId,
      hostUrl: `${window.location.protocol}//${window.location.host}/name-card`,
      user: {
        id: this.valueUserNameCard?.user?.id,
        avatar: this.valueAvatar,
        coverPhoto: this.valueCoverPhoto,
        fullName: this.formRegister.value.fullName,
        phoneNumber: this.formRegister.value.phoneNumber,
        email: this.formRegister.value.email,
        companyName: this.formRegister.value.companyName,
        position: this.formRegister.value.position,
        companyAddress: this.formRegister.value.companyAddress,
        websiteUrl: this.formRegister.value.websiteUrl,
      },
    };
    this.userNameCardService
      .UserNameCard_InsertUpdate(createUserNameCard)
      .subscribe({
        next: (response: any) => {
          if (response.resultCode === 'OK') {
            this.router.navigate([`view/name-card/${response.result.slug}`]);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating user name card:', error.error.message);
          this.toastr.error('Failed to create user name card', 'Error');
        },
      });
  }

  // Hàm lấy name card theo slug
  UserNameCard_GetBySlug(slug: string) {
    this.userNameCardService.UserNameCard_GetBySlug(slug).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          this.formRegister.patchValue({
            fullName: response.result.user.fullName,
            phoneNumber: response.result.user.phoneNumber,
            email: response.result.user.email,
            companyName: response.result.user.companyName,
            position: response.result.user.position,
            companyAddress: response.result.user.companyAddress,
            websiteUrl: response.result.user.websiteUrl,
          });
          this.valueAvatar = response.result.user.avatar;
          this.valueCoverPhoto = response.result.user.coverPhoto;
          this.valueTemplate = response.result.nameCardTemplate;
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            response.result.linkUrl
          );
          this.valueUserNameCard = response.result;
        }
      },
      error: (error) => {
        console.error('Error fetching UserNameCard:', error);
      },
    });
  }

  // Hàm chọn file và upload
  onSelectFile(event: any, status: number) {
    const selectedFile = event.addedFiles[0];

    if (selectedFile) {
      if (status === 0) {
        this.valueFileAvatar = selectedFile;
        this.File_Upload(selectedFile, 0);
      } else if (status === 1) {
        this.valueFileCoverPhoto = selectedFile;
        this.File_Upload(selectedFile, 1);
      }
    }
  }

  // Hàm xóa file
  onRemoveFile(event: any, status: any) {
    if (this.valueFileAvatar === event && status === 0) {
      this.valueFileAvatar = null;
    } else if (this.valueFileCoverPhoto === event && status === 1) {
      this.valueFileCoverPhoto = null;
    }
  }

  // Hàm upload file
  File_Upload(file: any, status: any): void {
    this.grapesjsService.Image_Upload(file).subscribe({
      next: (response: any) => {
        if (status === 0) {
          this.valueAvatar = response.src;
        } else if (status === 1) {
          this.valueCoverPhoto = response.src;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error uploading file:', error.error.message);
        this.toastr.error('Failed to upload file', 'Error');
      },
    });
  }
}
