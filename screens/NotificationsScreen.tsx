import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

type NotificationType = 'all' | 'like' | 'comment' | 'follow';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { isGuest, logout } = useAuth();

  const [selectedTab, setSelectedTab] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  useEffect(() => {
    if (isGuest) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert(
        'تسجيل الدخول مطلوب',
        'يجب عليك تسجيل الدخول لعرض الإشعارات',
        [
          {
            text: 'إلغاء',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'تسجيل الدخول',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    }
  }, [isGuest]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isGuest) {
      fetchNotifications();
    }
  }, [isGuest, fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: '#E94B3C' };
      case 'comment':
        return { name: 'chatbubble', color: COLORS.accent };
      case 'follow':
        return { name: 'person-add', color: '#4CAF50' };
      default:
        return { name: 'notifications', color: COLORS.accent };
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === 'all') return true;
    return notif.type === selectedTab;
  });

  const handleNotificationPress = async (notificationId: string, isRead: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!isRead) {
      try {
        await api.markNotificationAsRead(notificationId);
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    // Content navigation could be added here
  };

  const handleMarkAllAsRead = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await api.markAllNotificationsAsRead();

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('خطأ', 'فشل تحديث الإشعارات');
    }
  };

  const handleTabPress = (tab: NotificationType | 'all') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.headerIcon}>
            <Ionicons name="notifications" size={28} color="#FFF" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </LinearGradient>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>الإشعارات</Text>
        </View>
        <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
          <Ionicons name="checkmark-done" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          <TouchableOpacity
            onPress={() => handleTabPress('all')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'all' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'all' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('like')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'like' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="heart"
              size={16}
              color={selectedTab === 'like' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'like' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              الإعجابات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('comment')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'comment' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="chatbubble"
              size={16}
              color={selectedTab === 'comment' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'comment' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              التعليقات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('follow')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'follow' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="person-add"
              size={16}
              color={selectedTab === 'follow' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'follow' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              المتابعات
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        /* Notifications List */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          <View style={styles.notificationsContainer}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => {
                const icon = getIconForType(notification.type);
                return (
                  <Animated.View
                    key={notification.id}
                    entering={FadeInDown.delay(100 + index * 50).springify()}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleNotificationPress(notification.id, notification.is_read)}
                      style={[
                        styles.notificationCard,
                        {
                          backgroundColor: notification.is_read
                            ? COLORS.cardBg
                            : COLORS.accent + '10',
                        },
                      ]}
                    >
                      <View style={styles.notificationContent}>
                        {notification.sender_image ? (
                          <ExpoImage
                            source={{ uri: api.getFileUrl(notification.sender_image) ?? undefined }}
                            style={styles.userAvatar}
                            contentFit="cover"
                          />
                        ) : (
                          <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.userAvatar}>
                            <Ionicons name="person" size={20} color="#FFF" />
                          </LinearGradient>
                        )}

                        <View style={styles.notificationInfo}>
                          <View style={styles.notificationHeader}>
                            <Text style={[styles.userName, { color: COLORS.text }]}>
                              {notification.sender_name}
                            </Text>
                            <Text style={[styles.notificationText, { color: COLORS.textSecondary }]}>
                              {notification.content}
                            </Text>
                          </View>

                          <Text style={[styles.time, { color: COLORS.textSecondary }]}>
                            {new Date(notification.created_at).toLocaleDateString('ar-SA')}
                          </Text>
                        </View>

                        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                          <Ionicons name={icon.name as any} size={20} color={icon.color} />
                        </View>
                      </View>

                      {!notification.is_read && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
                <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد إشعارات</Text>
                <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                  ستظهر إشعاراتك هنا
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E94B3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  markAllButton: {
    padding: 8,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  tab: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  notificationsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  notificationCard: {
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notificationContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  notificationText: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
  },
  postTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    fontStyle: 'italic',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E94B3C',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
});