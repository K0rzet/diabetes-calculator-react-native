import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { carbsStore } from '../../stores/CarbsStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const CarbEntriesList = observer(() => {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.product.name}</Title>
        <Text>Количество: {item.amount}г</Text>
        <Text>Всего углеводов: {item.totalCarbs}г</Text>
        <Text style={styles.date}>
          {format(new Date(item.createdAt), 'dd MMMM yyyy HH:mm', { locale: ru })}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={carbsStore.entries}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      refreshing={carbsStore.isLoading}
      onRefresh={() => carbsStore.loadEntries()}
    />
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  date: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
}); 