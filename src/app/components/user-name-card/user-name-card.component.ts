import { GrapesJsService } from './../../services/grapesjs.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNameCardService } from '../../services/user-name-card.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShareComponent } from '../dialogs/share/share.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-name-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-name-card.component.html',
  styleUrl: './user-name-card.component.scss',
})
export class UserNameCardComponent {
  safeUrl: SafeResourceUrl | null = null; // URL for iframe
  valueUserNameCard: any = null; // Dữ liệu name card
  htmlContent: any = ''; // Nội dung html của name card

  constructor(
    private route: ActivatedRoute,
    private userNameCardService: UserNameCardService,
    private grapesjsService: GrapesJsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy slug từ URL
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.UserNameCard_GetBySlug(slug);
      }
    });
  }

  // Hàm lấy dữ liệu name card theo slug
  UserNameCard_GetBySlug(slug: string) {
    this.userNameCardService.UserNameCard_GetBySlug(slug).subscribe({
      next: (response: any) => {
        if (response.resultCode === 'OK') {
          // Set the URL for iframe
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

  // Hàm chuyển hướng đến trang chỉnh sửa name card
  btn_EditUserNameCard() {
    this.router.navigate([`edit/name-card/${this.valueUserNameCard.slug}`]);
  }

  // Hàm mở dialog chia sẻ qr và link
  btn_OpenShareDialog() {
    this.dialog.open(ShareComponent, {
      width: '600px',
      data: this.valueUserNameCard,
    });
  }
}
