import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-ride.component.html',
  styleUrl: './book-ride.component.css'
})

export class BookRideComponent {
  @Input() ride!: Ride;
  @Output() booked = new EventEmitter<{ success: boolean; message?: string }>();

  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    employeeId: ['', [Validators.required]]
  });

  constructor(private rideSvc: RideService) { }

  submit() {
    if (this.form.invalid) {
      this.booked.emit({ success: false, message: 'Please provide Employee ID' });
      return;
    }
    const id = this.form.value.employeeId!.trim();
    const res = this.rideSvc.bookRide(this.ride.id, id);
    this.booked.emit(res);
  }
}
