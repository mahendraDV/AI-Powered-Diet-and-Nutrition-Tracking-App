import { Observable } from '@nativescript/core';
import { DatabaseService } from './services/database.service';
import { AIService } from './services/ai.service';
import { Food } from './models/food.model';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export class MainViewModel extends Observable {
  private db: DatabaseService;
  private ai: AIService;

  selectedTab: number = 0;
  reportPeriod: number = 0;
  todaysFoods: Food[] = [];
  missingNutrients: string[] = [];
  recommendations: string[] = [];
  statistics: Array<{ name: string; value: string }> = [];
  
  newFood: Partial<Food> = {
    name: '',
    calories: 0,
    servingSize: 0,
    servingUnit: 'g',
    nutrients: []
  };

  constructor() {
    super();
    this.initializeServices();
  }

  async initializeServices() {
    this.db = new DatabaseService();
    this.ai = new AIService();
    
    await this.db.init();
    await this.ai.init();
    await this.loadTodaysFoods();
    await this.updateAnalysis();
  }

  async onAddFood() {
    if (!this.newFood.name || !this.newFood.calories) {
      // Show error message
      return;
    }

    const food: Food = {
      ...this.newFood as Food,
      timestamp: new Date(),
      nutrients: [] // In a real app, you'd want to add actual nutrients here
    };

    await this.db.addFood(food);
    await this.loadTodaysFoods();
    await this.updateAnalysis();

    // Reset form
    this.newFood = {
      name: '',
      calories: 0,
      servingSize: 0,
      servingUnit: 'g',
      nutrients: []
    };
    this.notifyPropertyChange('newFood', this.newFood);
  }

  async loadTodaysFoods() {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    this.todaysFoods = await this.db.getFoodsByDateRange(start, end);
    this.notifyPropertyChange('todaysFoods', this.todaysFoods);
  }

  async updateAnalysis() {
    const analysis = this.ai.analyzeDiet(this.todaysFoods);
    this.missingNutrients = analysis.missingNutrients;
    this.recommendations = analysis.recommendations;
    
    this.notifyPropertyChange('missingNutrients', this.missingNutrients);
    this.notifyPropertyChange('recommendations', this.recommendations);

    // Update statistics
    const totalCalories = this.todaysFoods.reduce((sum, food) => sum + food.calories, 0);
    this.statistics = [
      { name: 'Total Calories', value: totalCalories.toString() },
      { name: 'Meals Tracked', value: this.todaysFoods.length.toString() },
      // Add more statistics as needed
    ];
    this.notifyPropertyChange('statistics', this.statistics);
  }

  async onReportPeriodChange() {
    let start: Date;
    let end: Date;
    const now = new Date();

    switch (this.reportPeriod) {
      case 0: // Daily
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 1: // Weekly
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 2: // Monthly
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        return;
    }

    const foods = await this.db.getFoodsByDateRange(start, end);
    // Update charts and statistics based on the foods data
    this.updateReportView(foods);
  }

  private updateReportView(foods: Food[]) {
    // Update charts and statistics based on the selected period
    // This would involve using a charting library to visualize the data
    // and calculating relevant statistics
  }
}