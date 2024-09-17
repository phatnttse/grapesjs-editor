export class CreateUser {
  id: string | null;
  avatar: string;
  coverPhoto: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  position: string;
  companyAddress: string;
  websiteUrl: string;

  constructor(data: any) {
    this.id = data.id || '' || null;
    this.avatar = data.avatar || '';
    this.coverPhoto = data.coverPhoto || '';
    this.fullName = data.fullName || '';
    this.phoneNumber = data.phoneNumber || '';
    this.email = data.email || '';
    this.companyName = data.companyName || '';
    this.position = data.position || '';
    this.companyAddress = data.companyAddress || '';
    this.websiteUrl = data.websiteUrl || '';
  }
}
