import { Component, OnInit, inject } from '@angular/core';
import { RideService } from '../../services/ride.service';
import { Ride, VehicleType } from '../../models/ride.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookRideComponent } from '../book-ride/book-ride.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookRideComponent],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.css'
})
export class RideListComponent implements OnInit {
  rides: Ride[] = [];
  filtered: Ride[] = [];
  vehicleTypes: (VehicleType | 'All')[] = ['All', 'Car', 'Bike'];

  private fb = inject(FormBuilder);
  
  filterForm = this.fb.group({
    vehicleType: ['All'],
    time: [''] 
  });

  message = '';
  selectedRideId: string | null = null;

  constructor(private rideSvc: RideService) { }

  ngOnInit(): void {
    this.rideSvc.getRides().subscribe(list => {
      this.rides = list;
      this.applyFilters();
    });

    const t = new Date();
    const hh = t.getHours().toString().padStart(2, '0');
    const mm = t.getMinutes().toString().padStart(2, '0');
    this.filterForm.patchValue({ time: `${hh}:${mm}` });
    this.applyFilters();
  }

  applyFilters() {
    const vehicle = this.filterForm.value.vehicleType;
    const timeStr = this.filterForm.value.time;
    if (!timeStr) {
      this.filtered = this.rides.filter(r => vehicle === 'All' || r.vehicleType === vehicle);
      return;
    }
  
    const now = new Date();
    const [hh, mm] = timeStr.split(':');
    const q = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hh, +mm, 0).toISOString();
    this.filtered = this.rideSvc.findMatchingRides(q, vehicle === 'All' ? undefined : vehicle as VehicleType);
  }  

  selectRide(rideId: string) {
    this.selectedRideId = rideId;
    this.message = '';
  }

  handleBooked(event: { success: boolean; message?: string }) {
    if (event.success) {
      this.message = 'Booking successful';
      this.selectedRideId = null;
    } else {
      this.message = event.message || 'Booking failed';
    }
  }

  formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}