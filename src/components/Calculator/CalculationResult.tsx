import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';
import { InsulinCalculation } from '../../types/insulin.types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  calculation: InsulinCalculation;
}

export const CalculationResult: React.FC<Props> = ({ calculation }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Результат расчета</Title>
        <View style={styles.row}>
          <Text>Сахар:</Text>
          <Text>{calculation.currentSugarLevel} ммоль/л</Text>
        </View>
        <View style={styles.row}>
          <Text>Углеводы:</Text>
          <Text>{Math.round(calculation.carbAmount / 12 * 10) / 10} ХЕ</Text>
        </View>
        <View style={styles.row}>
          <Text>Коррекция:</Text>
          <Text>{calculation.correctionDose} ед</Text>
        </View>
        <View style={styles.row}>
          <Text>На еду:</Text>
          <Text>{calculation.mealDose} ед</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Общая доза:</Text>
          <Text style={styles.totalText}>{calculation.totalDose} ед</Text>
        </View>
        {calculation.notes && (
          <Text style={styles.notes}>{calculation.notes}</Text>
        )}
        <Text style={styles.date}>
          {format(new Date(calculation.createdAt), 'dd MMMM yyyy HH:mm', { locale: ru })}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  date: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
}); 