export type VehicleType = 'Bike' | 'Car';

export interface Ride {
  id: string;               
  employeeId: string;       
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;      
  timeISO: string;     
  pickupPoint: string;
  destination: string;
  bookedBy: string[];      
}