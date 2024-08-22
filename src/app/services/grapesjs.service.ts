import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CreatePageDto, Page, UpdatePageDto } from '../models/page.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageUpload } from '../models/image-upload';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsService {
  constructor(private http: HttpClient) {}

  createPage(page: CreatePageDto): Observable<Page> {
    return this.http.post<Page>(`${environment.apiBaseUrl}/page`, page);
  }

  getPageById(id: string): Observable<Page> {
    return this.http.get<Page>(`${environment.apiBaseUrl}/page/${id}`);
  }

  updatePage(page: UpdatePageDto): Observable<Page> {
    return this.http.patch<Page>(`${environment.apiBaseUrl}/page`, page);
  }

  uploadImage(file: File): Observable<ImageUpload> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUpload>(
      `${environment.apiBaseUrl}/form/upload`,
      formData
    );
  }

  uploadVideo(
    video: File,
    title: string,
    description: string,
    poster: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('videoFile', video);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('poster', poster);
    return this.http.post<any>(
      `${environment.apiBaseUrl}/form/upload-video`,
      formData
    );
  }

  getAssets(): Observable<ImageUpload[]> {
    return this.http.get<ImageUpload[]>(
      `${environment.apiBaseUrl}/form/assets`
    );
  }

  getHtmlFromUrl(url: string): Observable<string> {
    return this.http.get(`https://localhost:7191/${url}`, {
      responseType: 'text',
    });
  }
}
