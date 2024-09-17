import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterModule, MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Lấy giá trị 'role' từ route params
    this.route.paramMap.subscribe((params) => {
      const role = params.get('id');
      console.log(role);

      if (role === 'admin') {
      } else if (role === undefined || role === null) {
        this.router.navigate(['name-card/register']);
      }
    });
  }
}
