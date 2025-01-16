export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentDailyValue?: number;
}

export interface Food {
  id?: number;
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  nutrients: Nutrient[];
  timestamp: Date;
}