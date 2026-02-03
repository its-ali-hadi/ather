import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  newUsersToday: number;
  newPostsToday: number;
  activeUsers: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'post' | 'comment';
  title: string;
  subtitle: string;
  time: string;
}

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    newUsersToday: 0,
    newPostsToday: 0,
    activeUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    info: '#2196F3',
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.request('/admin/dashboard');
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('خطأ', 'فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleManageUsers = () => {
    Alert.alert('قريباً', 'ميزة إدارة المستخدمين قيد التطوير');
  };

  const handleManagePosts = () => {
    Alert.alert('قريباً', 'ميزة إدارة المنشورات قيد التطوير');
  };

  const handleManageReports = () => {
    Alert.alert('قريباً', 'ميزة إدارة البلاغات قيد التطوير');
  };

  const handleSettings = () => {
    Alert.alert('قريباً', 'ميزة إعدادات النظام قيد التطوير');
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
  }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    trend?: string;
  }) => (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[styles.statCard, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: COLORS.text }]}>{value.toLocaleString()}</Text>
        <Text style={[styles.statTitle, { color: COLORS.textSecondary }]}>{title}</Text>
        {trend && (
          <Text style={[styles.statTrend, { color: COLORS.success }]}>
            <Ionicons name="trending-up" size={12} /> {trend}
          </Text>
        )}
      </View>
    </Animated.View>
  );

  const ActionButton = ({
    title,
    icon,
    color,
    onPress,
  }: {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}
    >
      <View
        style={[styles.actionIconContainer, { backgroundColor: color }]}
      >
        <Ionicons name={icon as any} size={24} color="#FFF" />
      </View>
      <Text style={[styles.actionTitle, { color: COLORS.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color={COLORS.textSecondary} />
          <Text style={[styles.errorText, { color: COLORS.text }]}>
            ليس لديك صلاحية الوصول لهذه الصفحة
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={['#E8B86D', '#D4A574']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="shield-checkmark" size={32} color="#FFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.headerTitle, { color: COLORS.text }]}>لوحة التحكم</Text>
              <Text style={[styles.headerSubtitle, { color: COLORS.textSecondary }]}>
                مرحباً، {user?.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers}
            icon="people"
            color={COLORS.info}
            trend="+12% هذا الشهر"
          />
          <StatCard
            title="إجمالي المنشورات"
            value={stats.totalPosts}
            icon="document-text"
            color={COLORS.success}
            trend="+8% هذا الشهر"
          />
          <StatCard
            title="إجمالي التعليقات"
            value={stats.totalComments}
            icon="chatbubbles"
            color={COLORS.warning}
          />
          <StatCard
            title="إجمالي الإعجابات"
            value={stats.totalLikes}
            icon="heart"
            color={COLORS.danger}
          />
          <StatCard
            title="مستخدمين جدد اليوم"
            value={stats.newUsersToday}
            icon="person-add"
            color="#9C27B0"
          />
          <StatCard
            title="منشورات جديدة اليوم"
            value={stats.newPostsToday}
            icon="add-circle"
            color="#00BCD4"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>إجراءات سريعة</Text>
          <View style={styles.actionsContainer}>
            <ActionButton
              title="إدارة المستخدمين"
              icon="people"
              color={COLORS.info}
              onPress={handleManageUsers}
            />
            <ActionButton
              title="إدارة المنشورات"
              icon="document-text"
              color={COLORS.success}
              onPress={handleManagePosts}
            />
            <ActionButton
              title="البلاغات والشكاوى"
              icon="flag"
              color={COLORS.danger}
              onPress={handleManageReports}
            />
            <ActionButton
              title="إعدادات النظام"
              icon="settings"
              color={COLORS.warning}
              onPress={handleSettings}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>النشاط الأخير</Text>
          {recentActivity.length > 0 ? (
            <View style={styles.activityContainer}>
              {recentActivity.map((activity) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    { backgroundColor: COLORS.cardBg, borderColor: COLORS.border },
                  ]}
                >
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'user'
                            ? COLORS.info + '20'
                            : activity.type === 'post'
                              ? COLORS.success + '20'
                              : COLORS.warning + '20',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        activity.type === 'user'
                          ? 'person'
                          : activity.type === 'post'
                            ? 'document-text'
                            : 'chatbubble'
                      }
                      size={20}
                      color={
                        activity.type === 'user'
                          ? COLORS.info
                          : activity.type === 'post'
                            ? COLORS.success
                            : COLORS.warning
                      }
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { color: COLORS.text }]}>
                      {activity.title}
                    </Text>
                    <Text style={[styles.activitySubtitle, { color: COLORS.textSecondary }]}>
                      {activity.subtitle}
                    </Text>
                  </View>
                  <Text style={[styles.activityTime, { color: COLORS.textSecondary }]}>
                    {activity.time}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color={COLORS.textSecondary} />
              <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                لا يوجد نشاط حديث
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  statsGrid: {
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  statTitle: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    marginTop: 2,
  },
  statTrend: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  activitySubtitle: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
});