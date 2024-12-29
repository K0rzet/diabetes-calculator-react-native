import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api.service';
import { LoginData, RegisterData, User } from '../types/auth.types';

class AuthStore {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  isAuthenticated = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private async init() {
    try {
      console.log('Initializing auth store...');
      await this.checkAuth();
    } finally {
      runInAction(() => {
        this.isInitialized = true;
      });
    }
  }

  async login(data: LoginData) {
    try {
      this.isLoading = true;
      const response = await apiService.login(data);
      await this.handleAuthResponse(response.data);
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при входе';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(data: RegisterData) {
    try {
      this.isLoading = true;
      const response = await apiService.register(data);
      await this.handleAuthResponse(response.data);
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка при регистрации';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout() {
    await AsyncStorage.removeItem('token');
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  }

  private async handleAuthResponse(response: { access_token: string; user: User }) {
    await AsyncStorage.setItem('token', response.access_token);
    runInAction(() => {
      this.user = response.user;
      this.isAuthenticated = true;
      this.error = null;
    });
  }

  private async checkAuth() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token');
      }
      runInAction(() => {
        this.isAuthenticated = true;
      });
    } catch (error) {
      await AsyncStorage.removeItem('token');
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    }
  }
}

export const authStore = new AuthStore(); 