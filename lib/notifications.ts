import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Task } from './supabase';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleTaskReminder(task: Task, reminderTime: Date) {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Reminder',
      body: `Don't forget: ${task.title}`,
      data: { taskId: task.id },
    },
    trigger: {
      date: reminderTime,
    },
  });

  return identifier;
}

export async function cancelTaskReminder(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function sendWhatsAppReminder(phoneNumber: string, task: Task) {
  // You would implement Twilio WhatsApp integration here
  // This is just a placeholder for the implementation
  console.log('Sending WhatsApp reminder:', { phoneNumber, task });
}

export async function sendEmailReminder(email: string, task: Task) {
  // You would implement email sending here using Supabase Edge Functions
  // This is just a placeholder for the implementation
  console.log('Sending email reminder:', { email, task });
}

export function addNotificationResponseHandler(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export function addNotificationReceivedHandler(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
} 