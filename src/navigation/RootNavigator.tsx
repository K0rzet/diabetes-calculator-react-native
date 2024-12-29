import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import { AuthNavigator } from './AuthNavigator';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = observer(() => {
  if (!authStore.isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!authStore.isAuthenticated ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigator}
          options={{ gestureEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
}); 