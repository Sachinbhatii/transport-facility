import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRideComponent } from './add-ride.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let svc: RideService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRideComponent],
      imports: [ReactiveFormsModule],
      providers: [RideService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(RideService);
    fixture.detectChanges();
  });

  it('should reject adding a ride with a past date', () => {
    const now = new Date();
    const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 0);
    component.form.patchValue({
      employeeId: 'T1', vehicleType: 'Car', vehicleNo: 'Z1', vacantSeats: 2, time: y.toTimeString().slice(0, 5),
      pickupPoint: 'A', destination: 'B'
    });

    component.submit();
    expect(component.message).toContain('Ride time must be for the current day');
  });
});