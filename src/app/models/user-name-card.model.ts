import { CreateUser } from './user.model';

export class CreateUserNameCard {
  id: string | null;
  nameCardId: string;
  hostUrl: string;
  user: CreateUser;

  constructor(data: any) {
    this.id = data.id || '' || null;
    this.nameCardId = data.nameCardId || '';
    this.hostUrl = data.hostUrl || '';
    this.user = data.user || null;
  }
}
