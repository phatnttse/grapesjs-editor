import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NameCardTemplateService } from '../../services/name-card-template.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  listNameCardTemplates: any = []; // Danh sách card

  constructor(
    private nameCardTemplateService: NameCardTemplateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.NameCardTemplate_GetAll();
  }

  // Hàm lấy danh sách template card
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

  // Hàm chuyển hướng đến trang chỉnh sửa template card
  btn_EditNameCardTemplate(id: string) {
    this.router.navigate([`/template/${id}`]);
  }

  // Hàm xem chi tiết template card
  btn_NameCardTemplate_GetById(id: string) {
    this.nameCardTemplateService.NameCardTemplate_GetById(id).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          window.open(`${response.result.url}?` + Date.now());
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
