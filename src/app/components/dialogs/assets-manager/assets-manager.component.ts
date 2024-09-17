import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { GrapesJsService } from '../../../services/grapesjs.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-assets-manager',
  standalone: true,
  imports: [MatDialogModule, MatTabsModule, CommonModule],
  templateUrl: './assets-manager.component.html',
  styleUrls: ['./assets-manager.component.scss'],
})
export class AssetsManagerComponent {
  listImages: any[] = []; // Danh sách ảnh
  listVideos: any[] = []; // Danh sách video
  statusTab = 0; // Trạng thái tab {0: Ảnh, 1: Video}

  constructor(private grapesjsService: GrapesJsService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  // Hàm tải tài nguyên hình ảnh, video | statusTab = 0: Ảnh, statusTab = 1: Video
  loadAssets() {
    if (this.statusTab === 0) {
      if (this.listImages.length === 0) {
        this.Images_GetAll();
      }
    } else {
      if (this.listVideos.length === 0) {
        this.Video_GetAll();
      }
    }
  }

  // Hàm lấy danh sách ảnh
  Images_GetAll() {
    this.grapesjsService.Image_GetAll().subscribe({
      next: (response: any) => {
        this.listImages = response.items;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching assets:', error);
      },
    });
  }

  // Hàm lấy danh sách video
  Video_GetAll() {
    this.grapesjsService.Video_GetAll().subscribe({
      next: (response: any) => {
        this.listVideos = response.items;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching assets:', error);
      },
    });
  }

  // Hàm xử lý xoá ảnh
  btn_Image_Delete(image: any) {
    this.grapesjsService.Image_Delete(image.id).subscribe({
      next: (response: any) => {
        this.listImages = this.listImages.filter((img) => img !== image);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting image:', error);
      },
    });
  }

  // Hàm xử lý xoá video
  btn_Video_Delete(video: any) {
    this.grapesjsService.Image_Delete(video.id).subscribe({
      next: (response: any) => {
        this.listVideos = this.listVideos.filter((vdo) => vdo !== video);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting image:', error);
      },
    });
  }

  // Hàm xử lý khi thay đổi tab
  onTabChange(event: any) {
    this.statusTab = event.index;
    this.loadAssets();
  }
}
