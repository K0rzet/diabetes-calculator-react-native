import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Switch, Button, TextInput, Title } from 'react-native-paper';
import { notificationService } from '../../services/NotificationService';

export const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await notificationService.getSettings();
    setEnabled(settings.enabled);
    setHour(settings.hour.toString());
    setMinute(settings.minute.toString());
    setLoading(false);
  };

  const handleToggle = async () => {
    try {
      if (!enabled) {
        await notificationService.requestPermission();
        await notificationService.scheduleReminder(parseInt(hour), parseInt(minute));
      } else {
        await notificationService.cancelReminder();
      }
      setEnabled(!enabled);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const handleTimeChange = async () => {
    if (enabled) {
      const hourNum = parseInt(hour || '0');
      const minuteNum = parseInt(minute || '0');
      await notificationService.scheduleReminder(hourNum, minuteNum);
    }
  };

  const validateAndSetHour = (text: string) => {
    if (text === '' || (parseInt(text) >= 0 && parseInt(text) <= 23)) {
      setHour(text);
    }
  };

  const validateAndSetMinute = (text: string) => {
    if (text === '' || (parseInt(text) >= 0 && parseInt(text) <= 59)) {
      setMinute(text);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Напоминания</Title>
        
        <View style={styles.row}>
          <Text>Ежедневные напоминания</Text>
          <Switch value={enabled} onValueChange={handleToggle} />
        </View>

        {enabled && (
          <>
            <Text style={styles.description}>
              Уведомление будет приходить каждый день в{' '}
              {hour.padStart(2, '0')}:{minute.padStart(2, '0')}
            </Text>
            
            <View style={styles.timeContainer}>
              <TextInput
                label="Часы"
                value={hour}
                onChangeText={validateAndSetHour}
                keyboardType="numeric"
                maxLength={2}
                style={styles.timeInput}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                label="Минуты"
                value={minute}
                onChangeText={validateAndSetMinute}
                keyboardType="numeric"
                maxLength={2}
                style={styles.timeInput}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleTimeChange}
              style={styles.button}
            >
              Обновить время
            </Button>
          </>
        )}

        {!enabled && (
          <Text style={styles.disabledText}>
            Включите напоминания, чтобы не забывать о замерах уровня сахара
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeInput: {
    width: 80,
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 20,
  },
  button: {
    marginTop: 8,
  },
  disabledText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 