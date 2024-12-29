import axios from 'axios';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStore } from '../stores/AuthStore';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Charset': 'utf-8',
  },
  transformResponse: [...(axios.defaults.transformResponse as any[]), 
    (data: any) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
      if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'string') {
            try {
              data[key] = decodeURIComponent(escape(data[key]));
            } catch (e) {
            }
          }
        });
      }
      return data;
    }
  ],
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

export default api; 