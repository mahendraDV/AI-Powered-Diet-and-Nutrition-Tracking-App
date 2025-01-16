import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { trigger, transition, style, animate } from '@angular/animations';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ReportsComponent implements OnInit, AfterViewInit {
  caloriesChart: any;
  nutrientsChart: any;

  ngOnInit() {
    // In a real app, we would fetch this data from a service
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  private initializeCharts() {
    this.caloriesChart = new Chart('caloriesChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Calories',
          data: [2100, 1950, 2200, 1800, 2300, 1900, 2000],
          borderColor: '#673ab7',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Calorie Intake'
          }
        }
      }
    });

    this.nutrientsChart = new Chart('nutrientsChart', {
      type: 'radar',
      data: {
        labels: ['Protein', 'Carbs', 'Fat', 'Fiber', 'Vitamins', 'Minerals'],
        datasets: [{
          label: 'Current',
          data: [80, 65, 70, 55, 60, 75],
          borderColor: '#673ab7',
          backgroundColor: 'rgba(103, 58, 183, 0.2)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nutrient Balance'
          }
        }
      }
    });
  }
}