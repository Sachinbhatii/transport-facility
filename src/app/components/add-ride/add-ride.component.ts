import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RideService, VehicleType } from '../../services/ride.service';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride.component.html',
  styleUrl: './add-ride.component.css'
})

export class AddRideComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    employeeId: ['', [Validators.required]],
    vehicleType: ['Car', [Validators.required]],
    vehicleNo: ['', [Validators.required]],
    vacantSeats: [1, [Validators.required, Validators.min(1)]],
    time: ['', [Validators.required]], 
    pickupPoint: ['', [Validators.required]],
    destination: ['', [Validators.required]]
  });

  message = '';

  constructor(private rideSvc: RideService) { }

  submit() {
    this.message = '';
    if (this.form.invalid) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const now = new Date();
    const time = this.form.value.time!; 
    const [hoursStr, minsStr] = time.split(':');
    const rideDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hoursStr, +minsStr, 0);

    const payload = {
      employeeId: this.form.value.employeeId!.trim(),
      vehicleType: this.form.value.vehicleType! as VehicleType,
      vehicleNo: this.form.value.vehicleNo!.trim(),
      vacantSeats: Number(this.form.value.vacantSeats!),
      timeISO: rideDate.toISOString(),
      pickupPoint: this.form.value.pickupPoint!.trim(),
      destination: this.form.value.destination!.trim()
    };    


    const res = this.rideSvc.addRide(payload);
    if (!res.success) {
      this.message = res.message || 'Failed';
      return;
    }

    this.message = 'Ride added successfully!';
    this.form.reset({ vehicleType: 'Car', vacantSeats: 1 });
  }
}