import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { CarbEntryForm } from '../components/Carbs/CarbEntryForm';
import { CarbEntriesList } from '../components/Carbs/CarbEntriesList';
import { carbsStore } from '../stores/CarbsStore';

export const CarbsScreen = observer(() => {
  useEffect(() => {
    carbsStore.loadEntries();
  }, []);

  return (
    <View style={styles.container}>
      <CarbEntryForm />
      <CarbEntriesList />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 