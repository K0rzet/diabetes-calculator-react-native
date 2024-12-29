import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { insulinStore } from '../../stores/InsulinStore';

export const SettingsForm = observer(() => {
  const [values, setValues] = useState({
    targetSugarLevel: '',
    insulinSensitivityFactor: '',
    carbRatio: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (insulinStore.userSettings) {
      setValues({
        targetSugarLevel: insulinStore.userSettings.targetSugarLevel.toString(),
        insulinSensitivityFactor: insulinStore.userSettings.insulinSensitivityFactor.toString(),
        carbRatio: insulinStore.userSettings.carbRatio.toString(),
      });
    }
  }, [insulinStore.userSettings]);

  const handleSave = async () => {
    try {
      setError(null);
      await insulinStore.updateUserSettings({
        targetSugarLevel: Number(values.targetSugarLevel),
        insulinSensitivityFactor: Number(values.insulinSensitivityFactor),
        carbRatio: Number(values.carbRatio),
      });
    } catch (err) {
      setError('Ошибка при сохранении настроек');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Целевой уровень сахара (ммоль/л)"
        value={values.targetSugarLevel}
        onChangeText={(text) => setValues({ ...values, targetSugarLevel: text })}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Фактор чувствительности к инсулину"
        value={values.insulinSensitivityFactor}
        onChangeText={(text) => 
          setValues({ ...values, insulinSensitivityFactor: text })
        }
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Углеводный коэффициент"
        value={values.carbRatio}
        onChangeText={(text) => setValues({ ...values, carbRatio: text })}
        keyboardType="numeric"
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button 
        mode="contained" 
        onPress={handleSave}
        disabled={!values.targetSugarLevel || 
                 !values.insulinSensitivityFactor || 
                 !values.carbRatio}
      >
        Сохранить
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