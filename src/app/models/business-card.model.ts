export class BusinessCard {
  id: string;
  name: string;
  position: string;
  phone: string;
  thumbnail: string;
  src: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
    this.phone = data.phone;
    this.thumbnail = data.thumbnail;
    this.src = data.src;
  }
}

export class CreateBusinessCardDto {
  name: string;
  position: string;
  phone: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.name = data.name;
    this.position = data.position;
    this.phone = data.phone;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
export class UpdateBusinessCardDto {
  id: string;
  name: string;
  position: string;
  phone: string;
  thumbnail: string;
  content: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
    this.phone = data.phone;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
  }
}
