import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { CalculationResult } from '../Calculator/CalculationResult';
import { insulinStore } from '../../stores/InsulinStore';
import { ActivityIndicator } from 'react-native-paper';

export const HistoryList = observer(() => {
  const handleRefresh = () => {
    insulinStore.loadHistory();
  };

  const handleLoadMore = () => {
    if (!insulinStore.isLoading) {
      insulinStore.loadHistory(10, insulinStore.calculations.length);
    }
  };

  return (
    <FlatList
      data={insulinStore.calculations}
      renderItem={({ item }) => <CalculationResult calculation={item} />}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={insulinStore.isLoading}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        insulinStore.isLoading ? <ActivityIndicator style={styles.loader} /> : null
      }
    />
  );
});

const styles = StyleSheet.create({
  loader: {
    padding: 16,
  },
}); 