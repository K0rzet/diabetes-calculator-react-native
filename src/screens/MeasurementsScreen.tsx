import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Portal, Modal, IconButton, Text, SegmentedButtons } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { measurementsStore } from '../stores/MeasurementsStore';
import { MeasurementsList } from '../components/Measurements/MeasurementsList';
import { MeasurementStatistics } from '../components/Measurements/MeasurementStatistics';
import { AddMeasurementForm } from '../components/Measurements/AddMeasurementForm';
import { format } from 'date-fns';

type ViewMode = 'list' | 'statistics';

export const MeasurementsScreen = observer(() => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    await Promise.all([
      measurementsStore.loadDailyMeasurements(today),
      measurementsStore.loadStatistics(7)
    ]);
  };

  const handleAddSuccess = () => {
    loadData();
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={viewMode}
        onValueChange={value => setViewMode(value as ViewMode)}
        buttons={[
          { value: 'list', label: 'Измерения' },
          { value: 'statistics', label: 'Статистика' }
        ]}
        style={styles.viewSelector}
      />

      {viewMode === 'list' ? <MeasurementsList /> : <MeasurementStatistics />}

      <Portal>
        <Modal
          visible={showAddForm}
          onDismiss={() => setShowAddForm(false)}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Новое измерение</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowAddForm(false)}
              />
            </View>
            <AddMeasurementForm
              onSuccess={handleAddSuccess}
              onDismiss={() => setShowAddForm(false)}
            />
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddForm(true)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  viewSelector: {
    margin: 16,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 