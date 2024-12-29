import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation.types';

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Регистрация</Text>
        <RegisterForm />
        <Text 
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          Уже есть аккаунт? Войти
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
  },
  link: {
    textAlign: 'center',
    color: '#1976d2',
    marginTop: 16,
    marginBottom: 24,
  },
}); 