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
  status: string;
}
