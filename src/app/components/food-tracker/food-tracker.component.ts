import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-food-tracker',
  templateUrl: './food-tracker.component.html',
  styleUrls: ['./food-tracker.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FoodTrackerComponent {
  foodForm: FormGroup;
  todaysFoods: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      calories: ['', [Validators.required, Validators.min(0)]],
      servingSize: ['', [Validators.required, Validators.min(0)]],
      servingUnit: ['g', Validators.required]
    });
  }

  onSubmit() {
    if (this.foodForm.valid) {
      const food = {
        ...this.foodForm.value,
        timestamp: new Date()
      };
      this.todaysFoods.unshift(food);
      this.foodForm.reset({ servingUnit: 'g' });
      this.snackBar.open('Food added successfully!', 'Close', {
        duration: 3000
      });
    }
  }
}