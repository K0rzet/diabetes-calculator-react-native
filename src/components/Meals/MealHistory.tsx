import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Title, List, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { mealsStore } from '../../stores/MealsStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const formatCarbsWithBU = (carbs: number) => {
  const bu = Math.round((carbs / 12) * 10) / 10;
  return `${carbs.toFixed(1)}г (${bu} ХЕ)`;
};

export const MealHistory = observer(() => {
  useEffect(() => {
    console.log('MealHistory mounted, loading data...');
    mealsStore.loadMealHistory();
  }, []);

  console.log('MealHistory render:', {
    isLoading: mealsStore.isLoading,
    error: mealsStore.error,
    mealsCount: mealsStore.meals.length
  });

  if (mealsStore.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (mealsStore.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{mealsStore.error}</Text>
      </View>
    );
  }

  if (mealsStore.meals.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Нет записей о приемах пищи</Text>
      </View>
    );
  }

  const renderMealItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Text style={styles.totalCarbs}>
          Всего углеводов: {formatCarbsWithBU(item.totalCarbs)}
        </Text>
        
        {item.mealItems.map((mealItem, index) => (
          <List.Item
            key={index}
            title={mealItem.foodTemplate.name}
            description={`${mealItem.weight}г - ${formatCarbsWithBU(mealItem.carbAmount)} углеводов`}
          />
        ))}

        {item.notes && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}
        
        <Text style={styles.date}>
          {format(new Date(item.dateTime), 'dd MMMM yyyy HH:mm', { locale: ru })}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={mealsStore.meals}
      renderItem={renderMealItem}
      keyExtractor={(item) => item.id.toString()}
      refreshing={mealsStore.isLoading}
      onRefresh={() => mealsStore.loadMealHistory()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>Нет записей о приемах пищи</Text>
        </View>
      }
    />
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  totalCarbs: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  date: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
}); 