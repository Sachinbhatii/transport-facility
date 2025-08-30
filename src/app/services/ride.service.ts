import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ride, VehicleType } from '../models/ride.model';

function makeId() {
  return 'r-' + Math.random().toString(36).substr(2, 9);
}

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private rides: Ride[] = [];
  private rides$ = new BehaviorSubject<Ride[]>([]);

  constructor() {
    // Optionally seed with a couple of rides for demo
    // this.addRide({ employeeId: 'E100', vehicleType: 'Car', vehicleNo: 'MH12AB1234', vacantSeats: 3, timeISO: this.timeFor('09:30'), pickupPoint: 'Gate A', destination: 'Office' });
  }

  private uid() {
    return makeId();
  }

  getRides(): Observable<Ride[]> {
    return this.rides$.asObservable();
  }

  listRides(): Ride[] {
    return [...this.rides];
  }

  addRide(ridePayload: {
    employeeId: string;
    vehicleType: VehicleType;
    vehicleNo: string;
    vacantSeats: number;
    timeISO: string;
    pickupPoint: string;
    destination: string;
  }): { success: boolean; message?: string } {
    // validations: unique employeeId per ride (no duplicate rides by same employeeId)
    if (this.rides.some(r => r.employeeId === ridePayload.employeeId)) {
      return { success: false, message: 'Employee has already created a ride' };
    }

    const now = new Date();
    const rideDate = new Date(ridePayload.timeISO);
    // enforce current day only
    if (!(rideDate.getFullYear() === now.getFullYear()
      && rideDate.getMonth() === now.getMonth()
      && rideDate.getDate() === now.getDate())) {
      return { success: false, message: 'Ride time must be for the current day' };
    }

    const ride: Ride = {
      id: this.uid(),
      employeeId: ridePayload.employeeId,
      vehicleType: ridePayload.vehicleType,
      vehicleNo: ridePayload.vehicleNo,
      vacantSeats: ridePayload.vacantSeats,
      timeISO: new Date(ridePayload.timeISO).toISOString(),
      pickupPoint: ridePayload.pickupPoint,
      destination: ridePayload.destination,
      bookedBy: []
    };

    this.rides.push(ride);
    this.rides$.next(this.listRides());
    return { success: true };
  }

  // booking logic:
  // - employeeId cannot be the same as ride.employeeId
  // - employeeId cannot be already in ride.bookedBy
  // - vacantSeats must be > 0
  bookRide(rideId: string, employeeId: string): { success: boolean; message?: string } {
    const ride = this.rides.find(r => r.id === rideId);
    if (!ride) return { success: false, message: 'Ride not found' };
    if (ride.employeeId === employeeId) return { success: false, message: 'Cannot book your own ride' };
    if (ride.bookedBy.includes(employeeId)) return { success: false, message: 'Employee already booked this ride' };
    if (ride.vacantSeats <= 0) return { success: false, message: 'No seats available' };

    ride.vacantSeats -= 1;
    ride.bookedBy.push(employeeId);
    this.rides$.next(this.listRides());
    return { success: true };
  }

  findMatchingRides(queryTimeISO: string, vehicleType?: VehicleType): Ride[] {
    const queryTime = new Date(queryTimeISO).getTime();
    const sixtyMin = 60 * 60 * 1000;
    return this.rides.filter(r => {
      if (vehicleType && r.vehicleType !== vehicleType) return false;
      const t = new Date(r.timeISO).getTime();
      return Math.abs(t - queryTime) <= sixtyMin;
    });
  }

  // just return a ride by id
  getRide(rideId: string): Ride | undefined {
    return this.rides.find(r => r.id === rideId);
  }
}

export type { VehicleType };
