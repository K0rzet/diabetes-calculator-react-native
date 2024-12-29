import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { insulinStore } from '../../stores/InsulinStore';

export const CalculatorForm = observer(() => {
  const [values, setValues] = useState({
    currentSugarLevel: '',
    carbAmount: '',
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    try {
      setError(null);
      
      const currentSugar = parseFloat(values.currentSugarLevel.replace(',', '.'));
      const carbsInXE = parseFloat(values.carbAmount.replace(',', '.'));
      
      if (isNaN(currentSugar) || isNaN(carbsInXE)) {
        setError('Пожалуйста, введите корректные числовые значения');
        return;
      }

      const result = await insulinStore.calculateInsulin({
        currentSugarLevel: currentSugar,
        carbAmount: carbsInXE * 12,
        notes: values.notes || undefined
      });
      
      console.log('Отправляемые данные:', {
        currentSugarLevel: currentSugar,
        carbAmount: carbsInXE * 12,
        notes: values.notes || undefined
      });
      
    } catch (err) {
      setError('Ошибка при расчете');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Текущий уровень сахара"
        value={values.currentSugarLevel}
        onChangeText={(text) => setValues({ ...values, currentSugarLevel: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Количество углеводов (ХЕ)"
        value={values.carbAmount}
        onChangeText={(text) => setValues({ ...values, carbAmount: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Заметки"
        value={values.notes}
        onChangeText={(text) => setValues({ ...values, notes: text })}
        style={styles.input}
        mode="outlined"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button 
        mode="contained" 
        onPress={handleCalculate}
        disabled={!values.currentSugarLevel || !values.carbAmount}
      >
        Рассчитать
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
}); 