import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { HistoryList } from '../components/History/HistoryList';
import { insulinStore } from '../stores/InsulinStore';

export const HistoryScreen = observer(() => {
  useEffect(() => {
    insulinStore.loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <HistoryList />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 