import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent {
  linkUrl: any = ''; // Link URL
  qrCodeUrl: any = ''; // QR code URL
  statusTypeImage: any = 1; // Trạng thái loại ảnh tải về
  valueUser: any = null; // Dữ liệu user
  coverPhotoUrl: any = null; // Ảnh bìa

  setActiveButton(number: any) {
    this.statusTypeImage = number;
  }

  constructor(
    private dialogRef: MatDialogRef<ShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Dữ liệu name card truyền qua dialog
    private toastr: ToastrService
  ) {
    this.qrCodeUrl = data.qrCodeUrl;
    this.valueUser = data.user;
    this.coverPhotoUrl = data.user.coverPhoto;
    this.linkUrl = `${window.location.protocol}//${window.location.host}/name-card/${data.slug}`;
  }

  // Hàm tải về hình ảnh QR code
  btnDownloadQRCodeImage() {
    const element = document.getElementById('qr-img');
    if (element) {
      // Đợi một chút để đảm bảo tất cả các hình ảnh được tải
      setTimeout(() => {
        html2canvas(element, { useCORS: true })
          .then((canvas) => {
            const img = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = img;
            link.download = `QRCode.${this.getImageExtension()}`;
            link.click();
          })
          .catch((error) => {
            console.error('Error capturing the QR code image:', error);
          });
      }, 300); // Delay để đảm bảo nội dung được tải hoàn toàn
    }
  }

  // Hàm lấy đuôi file hình ảnh
  getImageExtension() {
    switch (this.statusTypeImage) {
      case 1:
        return 'png';
      case 2:
        return 'jpeg';
      case 3:
        return 'jpg';
      default:
        return 'png';
    }
  }

  // Hàm sao chép hình ảnh
  btnCopyAsImage() {
    const element = document.getElementById('qr-img');
    if (element) {
      html2canvas(element, { useCORS: true })
        .then((canvas) => {
          const img = canvas.toDataURL('image/png');
          this.copyImageToClipboard(img);
        })
        .catch((error) => {
          console.error('Error capturing the QR code image:', error);
        });
    }
  }

  // Hàm sao chép hình ảnh vào clipboard
  copyImageToClipboard(dataUrl: string) {
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard
          .write([clipboardItem])
          .then(() => {
            this.toastr.success('QR Code copied');
          })
          .catch((err) => {
            console.error('Failed to copy image: ', err);
          });
      });
  }

  // Hàm sao chép link
  btnCopyLink() {
    if (this.linkUrl) {
      navigator.clipboard.writeText(this.linkUrl);
      this.toastr.success('Link Code copied');
    }
  }
}
