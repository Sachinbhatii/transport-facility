import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
  });

  it('should add a ride and not allow duplicate employeeId on add', () => {
    const now = new Date();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString();
    const res1 = service.addRide({
      employeeId: 'E1', vehicleType: 'Car', vehicleNo: 'ABC', vacantSeats: 2, timeISO: t, pickupPoint: 'P', destination: 'D'
    });
    expect(res1.success).toBeTrue();

    const res2 = service.addRide({
      employeeId: 'E1', vehicleType: 'Bike', vehicleNo: 'B1', vacantSeats: 1, timeISO: t, pickupPoint: 'P', destination: 'D'
    });
    expect(res2.success).toBeFalse();
  });

  it('should book ride correctly and decrement seats', () => {
    const now = new Date();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString();
    const add = service.addRide({
      employeeId: 'E2', vehicleType: 'Car', vehicleNo: 'X1', vacantSeats: 2, timeISO: t, pickupPoint: 'P', destination: 'D'
    });
    expect(add.success).toBeTrue();
    const rides = service.listRides();
    const r = rides.find(x => x.employeeId === 'E2')!;
    expect(r.vacantSeats).toBe(2);

    const bookRes = service.bookRide(r.id, 'B1');
    expect(bookRes.success).toBeTrue();
    expect(r.vacantSeats).toBe(1);

    // cannot book own ride
    const ownBook = service.bookRide(r.id, 'E2');
    expect(ownBook.success).toBeFalse();

    // same person cannot book twice
    const bookAgain = service.bookRide(r.id, 'B1');
    expect(bookAgain.success).toBeFalse();
  });
});