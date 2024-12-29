import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api/axios';
import { Meal, FoodTemplate, CreateMealDto, CreateFoodTemplateDto } from '../types/meals.types';

class MealsStore {
  meals: Meal[] = [];
  templates: FoodTemplate[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private decodeText(text: string): string {
    try {
      return decodeURIComponent(escape(text));
    } catch (e) {
      return text;
    }
  }

  private processTemplate(template: FoodTemplate): FoodTemplate {
    return {
      ...template,
      name: this.decodeText(template.name)
    };
  }

  async createFoodTemplate(data: CreateFoodTemplateDto) {
    try {
      this.isLoading = true;
      const response = await api.post<FoodTemplate>('/meals/template', data);
      runInAction(() => {
        this.templates.push(this.processTemplate(response.data));
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при создании шаблона';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadTemplates() {
    try {
      this.isLoading = true;
      const response = await api.get<FoodTemplate[]>('/meals/templates');
      runInAction(() => {
        this.templates = response.data.map(template => this.processTemplate(template));
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке шаблонов';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createMeal(data: CreateMealDto) {
    try {
      this.isLoading = true;
      const response = await api.post<Meal>('/meals', data);
      runInAction(() => {
        this.meals.unshift(response.data);
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при создании приема пищи';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadMealHistory(limit = 10, offset = 0) {
    try {
      this.isLoading = true;
      console.log('Loading meal history...');
      const response = await api.get('/meals/history', {
        params: { limit, offset }
      });
      console.log('Meal history response:', response.data);
      runInAction(() => {
        this.meals = response.data.meals || [];
        this.error = null;
      });
    } catch (error) {
      console.error('Error loading meal history:', error);
      runInAction(() => {
        this.error = 'Ошибка при загрузке истории';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const mealsStore = new MealsStore(); 