import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@athar_push_token';

// تكوين كيفية عرض الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * طلب صلاحيات الإشعارات
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (!Device.isDevice) {
      console.log('يجب استخدام جهاز حقيقي للإشعارات');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('فشل الحصول على صلاحيات الإشعارات');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * الحصول على Push Token
 */
export const getPushToken = async (): Promise<string | null> => {
  try {
    // التحقق من وجود token محفوظ
    const savedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (savedToken) {
      return savedToken;
    }

    // طلب الصلاحيات
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // الحصول على token جديد
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // ضع project ID من app.json
    });

    const token = tokenData.data;

    // حفظ الـ token
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * إرسال إشعار محلي
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // إرسال فوري
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

/**
 * إلغاء جميع الإشعارات
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

/**
 * الحصول على عدد الإشعارات غير المقروءة (Badge)
 */
export const getBadgeCount = async (): Promise<number> => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

/**
 * تعيين عدد الإشعارات غير المقروءة (Badge)
 */
export const setBadgeCount = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

/**
 * مسح Badge
 */
export const clearBadge = async (): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Error clearing badge:', error);
  }
};

/**
 * الاستماع للإشعارات الواردة
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * الاستماع لنقرات الإشعارات
 */
export const addNotificationResponseReceivedListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * إزالة المستمع
 */
export const removeNotificationSubscription = (
  subscription: Notifications.Subscription
) => {
  Notifications.removeNotificationSubscription(subscription);
};

export default {
  requestNotificationPermissions,
  getPushToken,
  sendLocalNotification,
  cancelAllNotifications,
  getBadgeCount,
  setBadgeCount,
  clearBadge,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
};