import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Button } from 'react-native-paper';
import { SettingsForm } from '../components/Settings/SettingsForm';
import { insulinStore } from '../stores/InsulinStore';
import { authStore } from '../stores/AuthStore';
import { NotificationSettings } from '../components/Settings/NotificationSettings';

export const SettingsScreen = observer(() => {
  useEffect(() => {
    insulinStore.loadUserSettings();
  }, []);

  const handleLogout = async () => {
    await authStore.logout();
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsForm />
      <NotificationSettings />
      <Button 
        mode="outlined" 
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Выйти из аккаунта
      </Button>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    margin: 16,
  },
}); 