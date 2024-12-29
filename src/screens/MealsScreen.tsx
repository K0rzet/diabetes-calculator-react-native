import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FAB, Portal, Modal, IconButton } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { AddMealForm } from '../components/Meals/AddMealForm';
import { AddFoodTemplateForm } from '../components/Meals/AddFoodTemplateForm';
import { MealHistory } from '../components/Meals/MealHistory';
import { mealsStore } from '../stores/MealsStore';

export const MealsScreen = observer(() => {
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    mealsStore.loadTemplates();
    mealsStore.loadMealHistory();
  };

  const handleAddMealSuccess = () => {
    loadData();
  };

  const handleAddTemplateSuccess = () => {
    loadData();
  };

  return (
    <View style={styles.container}>
      <MealHistory />

      <Portal>
        <Modal
          visible={showAddMeal}
          onDismiss={() => setShowAddMeal(false)}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добавить прием пищи</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowAddMeal(false)}
              />
            </View>
              <AddMealForm 
                onSuccess={handleAddMealSuccess}
                onDismiss={() => setShowAddMeal(false)}
              />
          </View>
        </Modal>

        <Modal
          visible={showAddTemplate}
          onDismiss={() => setShowAddTemplate(false)}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="titleMedium">Добавить продукт</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowAddTemplate(false)}
              />
            </View>
            <AddFoodTemplateForm 
              onSuccess={handleAddTemplateSuccess}
              onDismiss={() => setShowAddTemplate(false)}
            />
          </View>
        </Modal>
      </Portal>

      <FAB.Group
        open={isFabOpen}
        visible={true}
        icon={isFabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'food',
            label: 'Добавить продукт',
            onPress: () => {
              setShowAddTemplate(true);
              setIsFabOpen(false);
            },
          },
          {
            icon: 'silverware',
            label: 'Добавить прием пищи',
            onPress: () => {
              setShowAddMeal(true);
              setIsFabOpen(false);
            },
          },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
        style={styles.fab}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalWrapper: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalBody: {
    flex: 1,
  },
}); 