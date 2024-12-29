import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, List, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { carbsStore } from '../../stores/CarbsStore';

export const CarbEntryForm = observer(() => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await carbsStore.loadProducts();
    } catch (err) {
      setError('Ошибка при загрузке продуктов');
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !amount) return;
    
    try {
      setError(null);
      await carbsStore.addEntry({
        productId: selectedProduct,
        amount: Number(amount)
      });
      setSelectedProduct(null);
      setAmount('');
    } catch (err) {
      setError('Ошибка при добавлении записи');
    }
  };

  const selectedProductData = carbsStore.products.find(p => p.id === selectedProduct);

  return (
    <View style={styles.container}>
      <Button 
        mode="outlined" 
        onPress={() => setShowProducts(!showProducts)}
        style={styles.input}
      >
        {selectedProductData ? selectedProductData.name : 'Выбрать продукт'}
      </Button>

      {showProducts && (
        <View style={styles.productsList}>
          {carbsStore.isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : carbsStore.products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text>Нет доступных продуктов</Text>
              <Button 
                mode="text" 
                onPress={loadProducts}
                style={styles.retryButton}
              >
                Обновить
              </Button>
            </View>
          ) : (
            <List.Section>
              {carbsStore.products.map(product => (
                <List.Item
                  key={product.id}
                  title={product.name}
                  description={`${product.carbsPer100g}г углеводов на 100г`}
                  onPress={() => {
                    setSelectedProduct(product.id);
                    setShowProducts(false);
                  }}
                />
              ))}
            </List.Section>
          )}
        </View>
      )}

      <TextInput
        label="Количество (г)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      
      <Button 
        mode="contained" 
        onPress={handleSubmit}
        disabled={!selectedProduct || !amount}
      >
        Добавить
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
  productsList: {
    maxHeight: 300,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
  },
  loader: {
    padding: 20,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
}); 