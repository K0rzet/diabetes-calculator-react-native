import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Calculator: undefined;
  History: undefined;
  Meals: undefined;
  Settings: undefined;
  Measurements: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>; 