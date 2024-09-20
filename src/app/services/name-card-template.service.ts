import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { InsertUpdateNameCardTemplateDto } from '../models/name-card-template.model';

@Injectable({
  providedIn: 'root',
})
export class NameCardTemplateService {
  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả các mẫu name card
  NameCardTemplate_GetAll(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/NameCardTemplate`);
  }

  // Lấy mẫu name card theo id
  NameCardTemplate_GetById(id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/NameCardTemplate/${id}`
    );
  }

  // Thêm hoặc cập nhật mẫu name card
  NameCardTemplate_InsertUpdate(
    insertUpdateNameCardTemplateDto: InsertUpdateNameCardTemplateDto
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/NameCardTemplate`,
      insertUpdateNameCardTemplateDto
    );
  }
}
