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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    userId: 'user-1',
    userName: 'أحمد محمد',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    content: 'أعجب بمنشورك',
    postTitle: 'تجربتي في تعلم React Native',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'comment',
    userId: 'user-2',
    userName: 'سارة أحمد',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'علّق على منشورك',
    postTitle: 'تجربتي في تعلم React Native',
    isRead: false,
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    type: 'follow',
    userId: 'user-3',
    userName: 'محمد علي',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'بدأ بمتابعتك',
    postTitle: null,
    isRead: true,
    createdAt: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    type: 'like',
    userId: 'user-4',
    userName: 'فاطمة خالد',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    content: 'أعجب بمنشورك',
    postTitle: 'قصة قصيرة: الطريق',
    isRead: true,
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '5',
    type: 'comment',
    userId: 'user-5',
    userName: 'خالد عمر',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    content: 'علّق على منشورك',
    postTitle: 'روتيني الصباحي للياقة',
    isRead: true,
    createdAt: '2024-01-13T11:30:00Z',
  },
];

type NotificationType = 'all' | 'likes' | 'comments' | 'follows';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
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
    if (selectedTab === 'likes') return notif.type === 'like';
    if (selectedTab === 'comments') return notif.type === 'comment';
    if (selectedTab === 'follows') return notif.type === 'follow';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationPress = (notificationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mark as read
    setNotifications(
      notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    // TODO: Navigate to post or profile
  };

  const handleMarkAllAsRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleTabPress = (tab: NotificationType) => {
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
            onPress={() => handleTabPress('likes')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'likes' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="heart"
              size={16}
              color={selectedTab === 'likes' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'likes' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              الإعجابات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('comments')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'comments' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="chatbubble"
              size={16}
              color={selectedTab === 'comments' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'comments' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              التعليقات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('follows')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'follows' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="person-add"
              size={16}
              color={selectedTab === 'follows' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'follows' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              المتابعات
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
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
                    onPress={() => handleNotificationPress(notification.id)}
                    style={[
                      styles.notificationCard,
                      {
                        backgroundColor: notification.isRead
                          ? COLORS.cardBg
                          : COLORS.accent + '10',
                      },
                    ]}
                  >
                    <View style={styles.notificationContent}>
                      {notification.userAvatar ? (
                        <ExpoImage
                          source={{ uri: notification.userAvatar }}
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
                            {notification.userName}
                          </Text>
                          <Text style={[styles.notificationText, { color: COLORS.textSecondary }]}>
                            {notification.content}
                          </Text>
                        </View>

                        {notification.postTitle && (
                          <Text
                            style={[styles.postTitle, { color: COLORS.textSecondary }]}
                            numberOfLines={1}
                          >
                            "{notification.postTitle}"
                          </Text>
                        )}

                        <Text style={[styles.time, { color: COLORS.textSecondary }]}>
                          {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                        </Text>
                      </View>

                      <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                        <Ionicons name={icon.name as any} size={20} color={icon.color} />
                      </View>
                    </View>

                    {!notification.isRead && <View style={styles.unreadDot} />}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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