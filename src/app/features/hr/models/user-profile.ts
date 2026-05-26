export class UserProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: string;
  jobTitleId?: string;
  departmentId?: string;
  profileImageUrl?: string;
  fullName?: string = `${this.firstName || ''} ${this.lastName || ''}`.trim();

 
}


