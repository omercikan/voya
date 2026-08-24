export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department: string;
}
