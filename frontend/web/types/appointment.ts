export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Appointment {
  id: string;
  customerId: number;
  dateStart: string;
  dateEnd: string;
  hourStart: string;
  hourEnd: string;
  vehicleId: string;
  purpose: string;
  note: string;
  status: AppointmentStatus;
}

export interface AppointmentResponse {
  id: string;
  dateStart: string;
  dateEnd: string;
  hourStart: string;
  hourEnd: string;
  note: string;
  purpose: string;
  status: AppointmentStatus;
  customer: Customer;
  vehicle: Vehicle;
}

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Vehicle {
  id: number;
  brand: string;
  fuel: string;
  gear: string;
  km: number;
  location: string;
  model: string;
  plate: string;
  year: number;
}
