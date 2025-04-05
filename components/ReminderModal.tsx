import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleTaskReminder } from '../lib/notifications';
import type { Task } from '../lib/supabase';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  task: Task;
}

export default function ReminderModal({ visible, onClose, task }: ReminderModalProps) {
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState({
    push: true,
    email: false,
    whatsapp: false,
  });

  const handleSetReminder = async () => {
    if (notificationTypes.push) {
      await scheduleTaskReminder(task, reminderDate);
    }
    // Here you would also handle email and WhatsApp notifications
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-xl p-4 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold">Set Reminder</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-500">Close</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="p-3 mb-4 border border-gray-200 rounded-lg"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>Remind me at: {reminderDate.toLocaleString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={reminderDate}
              mode="datetime"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setReminderDate(date);
                }
              }}
            />
          )}

          <View className="space-y-4 mb-4">
            <View className="flex-row justify-between items-center">
              <Text>Push Notification</Text>
              <Switch
                value={notificationTypes.push}
                onValueChange={(value) =>
                  setNotificationTypes({ ...notificationTypes, push: value })
                }
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text>Email Notification</Text>
              <Switch
                value={notificationTypes.email}
                onValueChange={(value) =>
                  setNotificationTypes({ ...notificationTypes, email: value })
                }
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text>WhatsApp Notification</Text>
              <Switch
                value={notificationTypes.whatsapp}
                onValueChange={(value) =>
                  setNotificationTypes({ ...notificationTypes, whatsapp: value })
                }
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg"
            onPress={handleSetReminder}
          >
            <Text className="text-white text-center font-semibold">
              Set Reminder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 