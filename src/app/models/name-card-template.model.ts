export class NameCardTemplate {
  id: string;
  name: string;
  thumbnail: string;
  src: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.src = data.src;
  }
}

export class CreateNameCardTemplateDto {
  name: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
export class UpdateNameCardTemplateDto {
  id: string;
  name: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
