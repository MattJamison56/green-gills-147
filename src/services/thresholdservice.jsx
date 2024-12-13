// Used in MainApp.jsx to constantly check if thresholds are being passed.
// Uses the data that the MainApp.jsx is constantly receiving to do so along with
// the ThresholdContext which can be changed on the Settings page
// Contains SMS code for when thresholds are passed :O

import { toast } from 'react-toastify';
import axios from 'axios';

const recipientPhoneNumber = '+19496273039';

const sendSMS = async (to, message) => {
  try {
    const response = await axios.post('http://localhost:5000/send-sms', { to, message });
    if (response.data.success) {
      console.log('SMS sent successfully!');
    } else {
      console.log('Failed to send SMS.');
    }
  } catch (error) {
    console.log('Error sending SMS:', error.message);
  }
};

export const checkThresholds = (data, thresholds, addNotification, notifiedIds) => {
  const isNotificationsEnabled = thresholds.notifs === 1;
  console.log(`Notifications Enabled: ${isNotificationsEnabled}`);

  const fieldMapping = {
    temp_high: 'temp_fahrenheit',
    temp_low: 'temp_fahrenheit',
    tds_high: 'tds_value',
    tds_low: 'tds_value',
    ph_high: 'ph_value',
    ph_low: 'ph_value',
    // Add more mappings as needed
  };

  // Process only the most recent data entry
  const latestData = data[data.length - 1];
  if (!latestData) return; // No data to process

  // Iterate through each threshold
  Object.keys(thresholds).forEach(key => {
    // Ignore 'notifs' key
    if (key === 'notifs') return;

    const threshold = thresholds[key];
    const field = fieldMapping[key];
    if (!field) {
      console.warn(`No field mapping found for threshold key: ${key}`);
      return;
    }

    let breach = false;

    if (key.endsWith('_low')) {
      breach = latestData[field] < threshold;
    } else if (key.endsWith('_high')) {
      breach = latestData[field] > threshold;
    }

    if (breach) {
      const timestamp = latestData.timestamp || latestData.datetime || new Date().toISOString();
      const notificationId = `${key}-${timestamp}`;

      // Check if this breach has already been notified
      if (notifiedIds.has(notificationId)) {
        console.log(`Notification for ${notificationId} already exists. Skipping.`);
        return;
      }

      console.log(`Creating notification for ${key}:`, latestData);

      const notification = {
        id: notificationId,
        pond: latestData.pond || `Pond 1`, // Make dynamic if multiple ponds are involved
        issue: `${key.replace('_', ' ')} alert: ${latestData[field]} at ${timestamp}`
      };
      addNotification(notification);

      // Add the notification ID to the set to prevent future duplicates
      notifiedIds.add(notificationId);

      if (!isNotificationsEnabled) {
        console.log(`Notifications disabled. Skipping SMS and toast for ${key}.`);
        return;
      }

      const message = `${notification.issue}`;
      sendSMS(recipientPhoneNumber, message);
      console.log(`SMS sent: ${message}`);

      if (!toast.isActive(`${key}Toast`)) {
        toast.warn(message, {
          toastId: `${key}Toast`
        });
        console.log(`Toast displayed for ${key}: ${message}`);
      }
    }
  });
};