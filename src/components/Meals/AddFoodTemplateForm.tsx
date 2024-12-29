import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { mealsStore } from '../../stores/MealsStore';

const formatCarbsWithBU = (carbs: number) => {
  const bu = Math.round((carbs / 12) * 10) / 10;
  return `${carbs.toFixed(1)}г (${bu} ХЕ)`;
};

export const AddFoodTemplateForm = observer(({ onSuccess, onDismiss }) => {
  const [values, setValues] = useState({
    name: '',
    carbsPer100g: '',
    defaultWeight: '100',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      await mealsStore.createFoodTemplate({
        name: values.name,
        carbsPer100g: Number(values.carbsPer100g),
        defaultWeight: Number(values.defaultWeight),
      });
      onSuccess?.();
      onDismiss?.();
    } catch (err) {
      setError('Ошибка при создании шаблона');
    }
  };

  const carbsInDefaultWeight = Number(values.carbsPer100g) * Number(values.defaultWeight) / 100;
  const carbsInfo = carbsInDefaultWeight > 0 ? formatCarbsWithBU(carbsInDefaultWeight) : '';

  return (
    <View style={styles.container}>
      <TextInput
        label="Название продукта"
        value={values.name}
        onChangeText={(text) => setValues({ ...values, name: text })}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Углеводы на 100г"
        value={values.carbsPer100g}
        onChangeText={(text) => setValues({ ...values, carbsPer100g: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Стандартная порция (г)"
        value={values.defaultWeight}
        onChangeText={(text) => setValues({ ...values, defaultWeight: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      
      {carbsInfo && (
        <Text style={styles.carbsInfo}>
          В стандартной порции: {carbsInfo}
        </Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      
      <Button 
        mode="contained" 
        onPress={handleSubmit}
        disabled={!values.name || !values.carbsPer100g}
        style={styles.submitButton}
      >
        Добавить продукт
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
  carbsInfo: {
    marginBottom: 12,
    color: '#666',
  },
  submitButton: {
    marginTop: 8,
  },
}); 