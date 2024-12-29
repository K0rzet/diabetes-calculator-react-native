import axios from 'axios';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData, RegisterData, AuthResponse } from '../types/auth.types';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data, {
      headers: {
        'Recaptcha': data.recaptchaToken
      }
    });
    if (response.data.accessToken) {
      await AsyncStorage.setItem('token', response.data.accessToken);
    }
    return response;
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data, {
      headers: {
        'Recaptcha': data.recaptchaToken
      }
    });
    if (response.data.accessToken) {
      await AsyncStorage.setItem('token', response.data.accessToken);
    }
    return response;
  },

  checkAuth: async () => {
    try {
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      await AsyncStorage.removeItem('token');
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    return true;
  }
}; 