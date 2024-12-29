import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Title, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { measurementsStore } from '../../stores/MeasurementsStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusLabels = {
  before_meal: 'До еды',
  after_meal: 'После еды',
  before_sleep: 'На ночь',
  fasting: 'Натощак',
};

const moodLabels = {
  good: 'Хорошее',
  normal: 'Нормальное',
  bad: 'Плохое',
};

export const MeasurementsList = observer(() => {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.sugarLevel} ммоль/л</Title>
        <Text style={styles.status}>{statusLabels[item.status]}</Text>
        {item.insulin && (
          <Text style={styles.insulin}>Инсулин: {item.insulin} ед</Text>
        )}
        {item.mood && (
          <Text style={styles.mood}>Самочувствие: {moodLabels[item.mood]}</Text>
        )}
        {item.notes && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}
        <Text style={styles.date}>
          {format(new Date(item.datetime), 'dd MMMM yyyy HH:mm', { locale: ru })}
        </Text>
      </Card.Content>
    </Card>
  );

  if (measurementsStore.isLoading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <FlatList
      data={measurementsStore.measurements}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
});

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  status: {
    marginTop: 4,
    color: '#666',
  },
  insulin: {
    marginTop: 4,
  },
  mood: {
    marginTop: 4,
    color: '#666',
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
  loader: {
    marginTop: 20,
  },
}); 