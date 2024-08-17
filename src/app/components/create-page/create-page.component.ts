import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import grapesjs from 'grapesjs';
import 'grapesjs-tailwind';
import { GrapesJsService } from '../../services/grapesjs.service';
import { Router } from '@angular/router';
import { Page } from '../../models/page.model';
import { GrapesjsConfig } from '../../configurations/grapesjs.config';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss',
})
export class CreatePageComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  editor: any;

  constructor(
    private grapesjsService: GrapesJsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editor = GrapesjsConfig(this.grapesjsService);
  }
  createPage() {
    const data = this.editor.getHtml();
    console.log('Data:', data);
    const page: Page = {
      id: Math.random().toString(),
      title: 'New Page - ' + Math.random(),
      content: data,
    };
    this.grapesjsService.createPage(page);
    console.log('Page created:', page);
    this.router.navigate(['']);
  }
}
