import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { CalculatorForm } from '../components/Calculator/CalculatorForm';
import { CalculationResult } from '../components/Calculator/CalculationResult';
import { insulinStore } from '../stores/InsulinStore';

export const CalculatorScreen = observer(() => {
  useEffect(() => {
    insulinStore.loadUserSettings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <CalculatorForm />
      {insulinStore.calculations[0] && (
        <CalculationResult calculation={insulinStore.calculations[0]} />
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 