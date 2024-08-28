import { Component } from '@angular/core';
import { GrapesJsService } from '../../services/grapesjs.service';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { BusinessCard } from '../../models/business-card.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  listBusinessCard: BusinessCard[] = []; // Danh sách trang
  valueSrc: any = null; // Url tạo trang
  ngOnInit(): void {
    this.getPages();
  }
  constructor(
    private grapesjsService: GrapesJsService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  getPages() {
    this.grapesjsService.getBusinessCards().subscribe({
      next: (response: BusinessCard[]) => {
        this.listBusinessCard = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
  edit(id: string) {
    this.router.navigate([`/edit-page/${id}`]);
  }
  view(id: string) {
    this.grapesjsService.getBusinessCardById(id).subscribe({
      next: (response: BusinessCard) => {
        window.open(`https://localhost:7191${response.src}`);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
