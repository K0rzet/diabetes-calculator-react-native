import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { LoginForm } from '../../components/Auth/LoginForm';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation.types';

export const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Вход в приложение</Text>
        <LoginForm />
        <Text 
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          Нет аккаунта? Зарегистрироваться
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
  scrollContent: {
    flexGrow: 1,
  },
}); 