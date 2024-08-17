import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GrapesJsService } from '../../services/grapesjs.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import grapesjs from 'grapesjs';
import 'grapesjs-tailwind';
import { Page } from '../../models/page.model';
import { ToastrService } from 'ngx-toastr';
import { GrapesjsConfig } from '../../configurations/grapesjs.config';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
})
export class EditPageComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  editor: any;
  pageId: string | null = null;
  page: Page | null = null;

  constructor(
    private grapesjsService: GrapesJsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.editor = GrapesjsConfig(this.grapesjsService);

    this.route.paramMap.subscribe((params) => {
      this.pageId = params.get('id');
      if (this.pageId) {
        this.loadPage(this.pageId);
      }
    });
  }

  savePage(): void {
    const updatedPage: Page = {
      id: this.pageId || Math.random().toString(),
      title: this.page?.title || 'New Page - ' + Math.random(),
      content: this.editor.getHtml(),
    };
    const pages = JSON.parse(localStorage.getItem('pages') || '[]');
    const pageIndex = pages.findIndex(
      (page: any) => page.id === updatedPage.id
    );
    console.log('Page:', updatedPage.content);

    if (pageIndex !== -1) {
      pages[pageIndex] = updatedPage;
    } else {
      pages.push(updatedPage);
    }
    localStorage.setItem('pages', JSON.stringify(pages));
    this.toastr.success('Success', 'Page saved successfully', {
      timeOut: 3000,
      progressBar: true,
    });
  }

  loadPage(id: string): void {
    const page = this.grapesjsService.getPageById(id);
    if (page) {
      this.page = page;
      this.editor.setComponents(page.content);
    }
  }
}
