import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Card, Text, Title, ActivityIndicator, Button, SegmentedButtons } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { measurementsStore } from '../../stores/MeasurementsStore';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(81, 45, 168, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 1,
};

const statusColors: { [key: string]: string } = {
  before_meal: '#FF6384',
  after_meal: '#36A2EB',
  fasting: '#4BC0C0',
};

const statusLabels: { [key: string]: string } = {
  before_meal: 'До еды',
  after_meal: 'После еды',
  fasting: 'Натощак',
};

const periodOptions = [
  { label: '7 дней', value: '7' },
  { label: '14 дней', value: '14' },
  { label: '30 дней', value: '30' },
];

export const MeasurementStatistics = observer(() => {
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    await measurementsStore.loadStatistics(Number(period));
  };

  if (measurementsStore.isLoading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (!measurementsStore.statistics || measurementsStore.statistics.total === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Нет данных для отображения статистики
            </Text>
            <Text style={styles.emptySubtext}>
              Добавьте несколько измерений, чтобы увидеть статистику
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => measurementsStore.loadStatistics(Number(selectedPeriod))}
              style={styles.retryButton}
            >
              Оновить
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const stats = measurementsStore.statistics;
  const byStatus = stats.byStatus || {};

  const formatValue = (value: number) => value?.toFixed(1) || '—';
  const getStatusAvg = (status: string) => {
    const values = byStatus[status];
    if (!values || values.length === 0) return '—';
    const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
    return formatValue(avg);
  };

  const lineChartData = {
    labels: [''],
    datasets: [
      {
        data: stats && stats.total > 0 && byStatus.before_meal ? byStatus.before_meal : [0],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: stats && stats.total > 0 && byStatus.after_meal ? byStatus.after_meal : [0],
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: stats && stats.total > 0 && byStatus.fasting ? byStatus.fasting : [0],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2,
      }
    ],
    legend: ['До еды', 'После еды', 'Натощак']
  };

  const pieChartData = stats && stats.total > 0 ? [
    {
      name: 'До еды',
      population: byStatus.before_meal?.length || 0,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'После еды',
      population: byStatus.after_meal?.length || 0,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Натощак',
      population: byStatus.fasting?.length || 0,
      color: '#4BC0C0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }
  ] : [
    {
      name: 'Нет данных',
      population: 1,
      color: '#cccccc',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.periodSelector}>
            <SegmentedButtons
              value={selectedPeriod}
              onValueChange={handlePeriodChange}
              buttons={periodOptions}
            />
          </View>

          <Title>Статистика за {selectedPeriod} дней</Title>
          
          <View style={styles.row}>
            <View style={styles.statItem}>
              <Text style={styles.label}>Средний сахар</Text>
              <Text style={styles.value}>{formatValue(stats.average)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.label}>Измерений</Text>
              <Text style={styles.value}>{stats.total}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.statItem}>
              <Text style={styles.label}>Минимум</Text>
              <Text style={styles.value}>{formatValue(stats.min)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.label}>Максимум</Text>
              <Text style={styles.value}>{formatValue(stats.max)}</Text>
            </View>
          </View>

          <Title style={styles.subtitle}>Средние значения</Title>
          
          <View style={styles.averages}>
            <Text style={styles.averageItem}>
              До еды: {getStatusAvg('before_meal')}
            </Text>
            <Text style={styles.averageItem}>
              После еды: {getStatusAvg('after_meal')}
            </Text>
            <Text style={styles.averageItem}>
              Натощак: {getStatusAvg('fasting')}
            </Text>
          </View>

          <Text style={styles.inTargetRange}>
            В целевом диапазоне: {stats.inTargetRange}%
          </Text>

          <Title style={styles.subtitle}>Динамика измерений</Title>
          <LineChart
            data={lineChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Title style={styles.subtitle}>Распределение измерений</Title>
          <PieChart
            data={pieChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  card: {
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  averages: {
    marginTop: 8,
  },
  averageItem: {
    marginVertical: 4,
  },
  loader: {
    margin: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  inTargetRange: {
    marginTop: 16,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: '500',
  },
  periodSelector: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
}); 