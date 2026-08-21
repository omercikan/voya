export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface User {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department: string;
}
