import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageUpload } from '../models/image-upload';
import { environment } from '../environments/environment.development';
import {
  BusinessCard,
  CreateBusinessCardDto,
  UpdateBusinessCardDto,
} from '../models/business-card.model';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsService {
  constructor(private http: HttpClient) {}

  getBusinessCards(): Observable<BusinessCard[]> {
    return this.http.get<BusinessCard[]>(
      `${environment.apiBaseUrl}/BusinessCard`
    );
  }

  createBusinessCard(
    businessCardDto: CreateBusinessCardDto
  ): Observable<BusinessCard> {
    return this.http.post<BusinessCard>(
      `${environment.apiBaseUrl}/BusinessCard`,
      businessCardDto
    );
  }

  getBusinessCardById(id: string): Observable<BusinessCard> {
    return this.http.get<BusinessCard>(
      `${environment.apiBaseUrl}/BusinessCard/${id}`
    );
  }

  updateBusinessCard(
    businessCardDto: UpdateBusinessCardDto
  ): Observable<BusinessCard> {
    return this.http.patch<BusinessCard>(
      `${environment.apiBaseUrl}/BusinessCard`,
      businessCardDto
    );
  }

  uploadImage(file: File): Observable<ImageUpload> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUpload>(
      `${environment.apiBaseUrl}/Grapesjs/upload`,
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
      `${environment.apiBaseUrl}/Grapesjs/upload-video`,
      formData
    );
  }

  getAssets(): Observable<ImageUpload[]> {
    return this.http.get<ImageUpload[]>(
      `${environment.apiBaseUrl}/Grapesjs/assets`
    );
  }

  getHtmlFromUrl(url: string): Observable<string> {
    return this.http.get(`https://localhost:7191/${url}`, {
      responseType: 'text',
    });
  }
}
