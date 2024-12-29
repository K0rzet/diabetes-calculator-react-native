import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api/axios';
import { InsulinCalculation, UserSettings, CalculationInput } from '../types/insulin.types';

class InsulinStore {
  calculations: InsulinCalculation[] = [];
  userSettings: UserSettings | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async calculateInsulin(data: CalculationInput) {
    try {
      this.isLoading = true;
      const response = await api.post<InsulinCalculation>('/insulin/calculate', data);
      runInAction(() => {
        this.calculations.unshift(response.data);
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при расчете дозы';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadHistory(limit = 10, offset = 0) {
    try {
      this.isLoading = true;
      const response = await api.get(`/insulin/history?limit=${limit}&offset=${offset}`);
      runInAction(() => {
        this.calculations = response.data.calculations;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке истории';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadUserSettings() {
    try {
      const response = await api.get<UserSettings>('/insulin/settings');
      runInAction(() => {
        this.userSettings = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке настроек';
      });
    }
  }

  async updateUserSettings(settings: UserSettings) {
    try {
      const response = await api.put<UserSettings>('/insulin/settings', settings);
      runInAction(() => {
        this.userSettings = response.data;
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при обновлении настроек';
      });
      throw error;
    }
  }
}

export const insulinStore = new InsulinStore(); 