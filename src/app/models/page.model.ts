export class Page {
  id: string;
  title: string;
  thumbnail: string;
  src: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.src = data.src;
  }
}

export class CreatePageDto {
  title: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
export class UpdatePageDto {
  id: string;
  title: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
