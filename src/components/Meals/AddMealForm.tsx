import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, Text, List, IconButton, Card } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { mealsStore } from '../../stores/MealsStore';
import { CreateMealItemDto } from '../../types/meals.types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const AddMealForm = observer(({ onSuccess, onDismiss }) => {
  const [values, setValues] = useState({
    name: '',
    notes: '',
  });
  const [selectedItems, setSelectedItems] = useState<CreateMealItemDto[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mealsStore.loadTemplates();
  }, []);

  const handleAddItem = (templateId: number, defaultWeight: number) => {
    setSelectedItems([
      ...selectedItems,
      { foodTemplateId: templateId, weight: defaultWeight }
    ]);
    setShowTemplates(false);
  };

  const handleUpdateWeight = (index: number, weight: string) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...newItems[index], weight: Number(weight) };
    setSelectedItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      await mealsStore.createMeal({
        name: values.name,
        items: selectedItems,
        notes: values.notes || undefined,
      });
      onSuccess?.();
      onDismiss?.();
    } catch (err) {
      setError('Ошибка при создании приема пищи');
    }
  };

  const formatCarbsWithBU = (carbs: number) => {
    const bu = Math.round((carbs / 12) * 10) / 10;
    return `${carbs.toFixed(1)}г (${bu} ХЕ)`;
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Название приема пищи"
        value={values.name}
        onChangeText={(text) => setValues({ ...values, name: text })}
        style={styles.input}
        mode="outlined"
      />

      <Button 
        mode="outlined" 
        onPress={() => setShowTemplates(!showTemplates)}
        style={styles.input}
      >
        Добавить продукт
      </Button>

      {showTemplates && (
        <Card style={styles.templatesCard}>
          <Card.Content>
            {mealsStore.templates.map(template => (
              <List.Item
                key={template.id}
                title={template.name}
                description={`${template.carbsPer100g}г углеводов на 100г (${formatCarbsWithBU(template.carbsPer100g)})`}
                right={props => (
                  <Button 
                    {...props} 
                    onPress={() => handleAddItem(template.id, template.defaultWeight)}
                  >
                    Добавить
                  </Button>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {selectedItems.map((item, index) => {
        const template = mealsStore.templates.find(t => t.id === item.foodTemplateId);
        if (!template) return null;
        
        const totalCarbs = template.carbsPer100g * item.weight / 100;

        return (
          <Card key={index} style={styles.itemCard}>
            <Card.Content>
              <View style={styles.itemRow}>
                <Text>{template.name}</Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => handleRemoveItem(index)}
                />
              </View>
              <TextInput
                label="Вес (г)"
                value={String(item.weight)}
                onChangeText={(text) => handleUpdateWeight(index, text)}
                keyboardType="numeric"
                style={styles.weightInput}
                mode="outlined"
              />
              <Text style={styles.carbsText}>
                Углеводы: {formatCarbsWithBU(totalCarbs)}
              </Text>
            </Card.Content>
          </Card>
        );
      })}

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
        disabled={!values.name || selectedItems.length === 0}
        style={styles.submitButton}
      >
        Сохранить прием пищи
      </Button>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  templatesCard: {
    marginBottom: 12,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightInput: {
    marginTop: 8,
  },
  carbsText: {
    marginTop: 8,
    color: '#666',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
}); 