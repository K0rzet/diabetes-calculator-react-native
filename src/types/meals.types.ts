export interface FoodTemplate {
  id: number;
  name: string;
  carbsPer100g: number;
  defaultWeight: number;
}

export interface MealItem {
  foodTemplateId: number;
  weight: number;
  carbAmount: number;
  foodTemplate: FoodTemplate;
}

export interface Meal {
  id: number;
  name: string;
  totalCarbs: number;
  notes?: string;
  dateTime: string;
  mealItems: MealItem[];
}

export interface CreateMealItemDto {
  foodTemplateId: number;
  weight: number;
}

export interface CreateMealDto {
  name: string;
  items: CreateMealItemDto[];
  notes?: string;
}

export interface CreateFoodTemplateDto {
  name: string;
  carbsPer100g: number;
  defaultWeight?: number;
} 