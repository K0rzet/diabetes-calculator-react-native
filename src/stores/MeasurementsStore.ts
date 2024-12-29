import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api/axios';
import { SugarMeasurement, CreateMeasurementDto, MeasurementStatistics } from '../types/measurements.types';

class MeasurementsStore {
  measurements: SugarMeasurement[] = [];
  statistics: MeasurementStatistics | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async createMeasurement(data: CreateMeasurementDto) {
    try {
      this.isLoading = true;
      const response = await api.post<SugarMeasurement>('/measurements', data);
      runInAction(() => {
        this.measurements.unshift(response.data);
        this.error = null;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при создании измерения';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadDailyMeasurements(date: string) {
    try {
      this.isLoading = true;
      const response = await api.get<SugarMeasurement[]>(`/measurements/daily?date=${date}`);
      runInAction(() => {
        this.measurements = response.data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке измерений';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadStatistics(days: number = 7) {
    try {
      this.isLoading = true;
      const response = await api.get<MeasurementStatistics>(`/measurements/statistics?days=${days}`);
      runInAction(() => {
        this.statistics = response.data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке статистики';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadRecentMeasurements(limit: number = 10) {
    try {
      this.isLoading = true;
      const response = await api.get<SugarMeasurement[]>(`/measurements/recent?limit=${limit}`);
      runInAction(() => {
        this.measurements = response.data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при загрузке последних измерений';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const measurementsStore = new MeasurementsStore(); 