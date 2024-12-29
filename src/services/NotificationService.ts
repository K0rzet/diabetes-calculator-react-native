import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async scheduleReminder(hour: number, minute: number) {
    await this.cancelReminder();

    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание о замере',
        body: 'Пора измерить уровень сахара в крови',
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: minute,
      },
    });

    await this.saveSettings({
      enabled: true,
      hour,
      minute,
    });

    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduledNotifications);
  }

  async cancelReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await this.saveSettings({
      enabled: false,
      hour: 0,
      minute: 0,
    });
  }

  async getSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : { enabled: false, hour: 9, minute: 0 };
    } catch {
      return { enabled: false, hour: 9, minute: 0 };
    }
  }

  private async saveSettings(settings: NotificationSettings) {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  }
}

export const notificationService = new NotificationService(); 