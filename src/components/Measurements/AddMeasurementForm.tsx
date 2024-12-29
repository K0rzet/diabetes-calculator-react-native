import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { measurementsStore } from '../../stores/MeasurementsStore';
import { MeasurementStatus } from '../../types/measurements.types';

interface Props {
  onSuccess?: () => void;
  onDismiss?: () => void;
}

const statusOptions = [
  { label: 'До еды', value: 'before_meal' },
  { label: 'После еды', value: 'after_meal' },
  { label: 'На ночь', value: 'before_sleep' },
  { label: 'Натощак', value: 'fasting' },
];

const moodOptions = [
  { label: 'Хорошее', value: 'good' },
  { label: 'Нормальное', value: 'normal' },
  { label: 'Плохое', value: 'bad' },
];

export const AddMeasurementForm = observer(({ onSuccess, onDismiss }: Props) => {
  const [values, setValues] = useState({
    sugarLevel: '',
    status: 'before_meal' as MeasurementStatus,
    notes: '',
    mood: 'normal',
    insulin: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const sugarLevel = parseFloat(values.sugarLevel.replace(',', '.'));
      const insulin = values.insulin ? parseFloat(values.insulin.replace(',', '.')) : undefined;

      if (isNaN(sugarLevel)) {
        setError('Введите корректный уровень сахара');
        return;
      }

      await measurementsStore.createMeasurement({
        sugarLevel,
        status: values.status,
        notes: values.notes || undefined,
        mood: values.mood,
        insulin,
      });

      onSuccess?.();
      onDismiss?.();
    } catch (err) {
      setError('Ошибка при сохранении измерения');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Уровень сахара"
        value={values.sugarLevel}
        onChangeText={(text) => setValues({ ...values, sugarLevel: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.label}>Статус измерения</Text>
      <SegmentedButtons
        value={values.status}
        onValueChange={(value) => setValues({ ...values, status: value as MeasurementStatus })}
        buttons={statusOptions}
        style={styles.segmentedButtons}
      />

      <Text style={styles.label}>Самочувствие</Text>
      <SegmentedButtons
        value={values.mood}
        onValueChange={(value) => setValues({ ...values, mood: value })}
        buttons={moodOptions}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Введенный инсулин (ед)"
        value={values.insulin}
        onChangeText={(text) => setValues({ ...values, insulin: text })}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Заметки"
        value={values.notes}
        onChangeText={(text) => setValues({ ...values, notes: text })}
        multiline
        style={styles.input}
        mode="outlined"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!values.sugarLevel}
        style={styles.submitButton}
      >
        Сохранить измерение
      </Button>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 8,
  },
}); 