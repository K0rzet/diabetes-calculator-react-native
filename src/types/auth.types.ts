export interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type AuthNavigationType = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
}; 