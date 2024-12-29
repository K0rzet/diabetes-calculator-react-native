import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MealsScreen } from '../screens/MealsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types/navigation.types';
import { MeasurementsScreen } from '../screens/MeasurementsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: 'Калькулятор',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Meals"
        component={MealsScreen}
        options={{
          title: 'Питание',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food-fork-drink" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'История',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Measurements"
        component={MeasurementsScreen}
        options={{
          title: 'Измерения',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="diabetes" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 