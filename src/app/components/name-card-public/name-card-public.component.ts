import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserNameCardService } from '../../services/user-name-card.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShareComponent } from '../dialogs/share/share.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-name-card-public',
  standalone: true,
  imports: [RouterModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './name-card-public.component.html',
  styleUrl: './name-card-public.component.scss',
})
export class NameCardPublicComponent {
  safeUrl: SafeResourceUrl | null = null; // URL for iframe
  valueUserNameCard: any = null; // Dữ liệu name card

  constructor(
    private route: ActivatedRoute,
    private userNameCardService: UserNameCardService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Lấy slug từ URL
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.getUserNameCardBySlug(slug);
      }
    });
  }

  // Hàm lấy dữ liệu name card theo slug
  getUserNameCardBySlug(slug: string) {
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

  // Hàm mở dialog chia sẻ qr và link
  btnOpenShareDialog() {
    this.dialog.open(ShareComponent, {
      width: '600px',
      data: this.valueUserNameCard,
    });
  }
}
