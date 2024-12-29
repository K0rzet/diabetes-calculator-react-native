import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api/axios';
import { CarbProduct, CarbEntry, AddCarbEntryInput } from '../types/carbs.types';

class CarbsStore {
  products: CarbProduct[] = [];
  entries: CarbEntry[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadProducts() {
    try {
      this.isLoading = true;
      const response = await api.get<CarbProduct[]>('/carbs/products');
      runInAction(() => {
        this.products = response.data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке продуктов';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addEntry(data: AddCarbEntryInput) {
    try {
      this.isLoading = true;
      const response = await api.post<CarbEntry>('/carbs/entries', data);
      runInAction(() => {
        this.entries.unshift(response.data);
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при добавлении записи';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadEntries(limit = 10, offset = 0) {
    try {
      this.isLoading = true;
      const response = await api.get<CarbEntry[]>(`/carbs/entries?limit=${limit}&offset=${offset}`);
      runInAction(() => {
        this.entries = response.data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке записей';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const carbsStore = new CarbsStore(); 