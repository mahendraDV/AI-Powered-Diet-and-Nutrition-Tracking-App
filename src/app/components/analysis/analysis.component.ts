import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
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
export class AnalysisComponent implements OnInit {
  missingNutrients = [
    'Vitamin D',
    'Iron',
    'Calcium'
  ];

  recommendations = [
    'Add more leafy greens for iron intake',
    'Consider having fatty fish for Vitamin D',
    'Include dairy products for calcium'
  ];

  ngOnInit() {
    // In a real app, we would fetch this data from the AI service
  }
}