import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Page } from '../models/page.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageUpload, ImageUploadResponse } from '../models/image-upload';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsService {
  localStorage?: Storage;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  createPage(page: Page): void {
    const pages = JSON.parse(localStorage.getItem('pages') || '[]');
    pages.push(page);
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  getPages(): Page[] {
    return JSON.parse(localStorage.getItem('pages') || '[]');
  }
  getPageById(id: string): Page | undefined {
    const pages: Page[] = JSON.parse(localStorage.getItem('pages') || '[]');
    return pages.find((page) => page.id === id);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      'https://localhost:7191/api/v1/form/upload',
      formData
    );
  }
}
