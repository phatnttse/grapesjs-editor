import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { NameCardTemplateService } from '../../services/name-card-template.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  listNameCardTemplates: any = []; // Danh sách card

  constructor(
    private nameCardTemplateService: NameCardTemplateService,
    private router: Router
  ) {}

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

  editNameCardTemplate(id: string) {
    this.router.navigate([`/insert-update-page/${id}`]);
  }

  viewNameCardTemplate(id: string) {
    this.nameCardTemplateService.getNameCardTemplateById(id).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          window.open(
            `https://localhost:7191${response.result.url}?` + Date.now()
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
