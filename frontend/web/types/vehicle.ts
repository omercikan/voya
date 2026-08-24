export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
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
  status: VehicleStatus;
  year: number;
}
