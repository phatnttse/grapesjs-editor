export class ImageUpload {
  src: string;
  type: string;
  width: string;
  height: string;

  constructor(src: string, type: string, width: string, height: string) {
    this.src = src;
    this.type = type;
    this.width = width;
    this.height = height;
  }
}
export interface ImageUploadResponse {
  data: ImageUpload;
}
