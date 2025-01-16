import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  todayStats = {
    calories: 1200,
    meals: 3,
    protein: 65,
    carbs: 150,
    fat: 45
  };

  recentMeals = [
    { name: 'Breakfast', calories: 350, time: '8:00 AM' },
    { name: 'Lunch', calories: 450, time: '12:30 PM' },
    { name: 'Snack', calories: 150, time: '3:00 PM' }
  ];

  ngOnInit() {
    // In a real app, we would fetch this data from a service
  }
}