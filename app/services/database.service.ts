import { Sqlite } from '@nativescript-community/sqlite';

export class DatabaseService {
  private db: Sqlite;

  async init() {
    this.db = await new Sqlite('diet_tracker');
    await this.createTables();
  }

  private async createTables() {
    await this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        serving_size REAL NOT NULL,
        serving_unit TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS nutrients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        food_id INTEGER,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        unit TEXT NOT NULL,
        daily_value REAL,
        FOREIGN KEY (food_id) REFERENCES foods (id)
      )
    `);
  }

  async addFood(food: Food): Promise<number> {
    const result = await this.db.execSQL(
      `INSERT INTO foods (name, calories, serving_size, serving_unit, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [food.name, food.calories, food.servingSize, food.servingUnit, food.timestamp.toISOString()]
    );

    const foodId = result.insertId;

    for (const nutrient of food.nutrients) {
      await this.db.execSQL(
        `INSERT INTO nutrients (food_id, name, amount, unit, daily_value)
         VALUES (?, ?, ?, ?, ?)`,
        [foodId, nutrient.name, nutrient.amount, nutrient.unit, nutrient.percentDailyValue]
      );
    }

    return foodId;
  }

  async getFoodsByDateRange(startDate: Date, endDate: Date): Promise<Food[]> {
    const foods: Food[] = [];
    const rows = await this.db.all(
      `SELECT * FROM foods 
       WHERE timestamp BETWEEN ? AND ?
       ORDER BY timestamp DESC`,
      [startDate.toISOString(), endDate.toISOString()]
    );

    for (const row of rows) {
      const nutrients = await this.db.all(
        `SELECT * FROM nutrients WHERE food_id = ?`,
        [row.id]
      );

      foods.push({
        id: row.id,
        name: row.name,
        calories: row.calories,
        servingSize: row.serving_size,
        servingUnit: row.serving_unit,
        timestamp: new Date(row.timestamp),
        nutrients: nutrients.map(n => ({
          name: n.name,
          amount: n.amount,
          unit: n.unit,
          percentDailyValue: n.daily_value
        }))
      });
    }

    return foods;
  }
}