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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useState } from 'react';

import SeedData from '../constants/seed-data.json';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

export default function UserProfileScreen({ route }: Props) {
  const { userId } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  // Mock user data
  const user = {
    id: userId,
    name: 'أحمد محمد',
    username: '@ahmed_dev',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'مطور تطبيقات | مهتم بالتقنية والبرمجة | أحب مشاركة المعرفة',
    followers: 1234,
    following: 567,
    posts: 89,
    joinDate: '2023-06-15',
  };

  const userPosts = SeedData.posts.filter((post) => post.userId === userId);

  const handleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('الرسائل', 'ميزة الرسائل قريباً...');
  };

  const handleBlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'حظر المستخدم',
      `هل تريد ${isBlocked ? 'إلغاء حظر' : 'حظر'} ${user.name}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: isBlocked ? 'إلغاء الحظر' : 'حظر',
          style: 'destructive',
          onPress: () => {
            setIsBlocked(!isBlocked);
            Alert.alert('تم', `تم ${isBlocked ? 'إلغاء حظر' : 'حظر'} المستخدم`);
          },
        },
      ]
    );
  };

  const handleReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'الإبلاغ عن المستخدم',
      'هل تريد الإبلاغ عن هذا المستخدم؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إبلاغ',
          style: 'destructive',
          onPress: () => Alert.alert('تم الإبلاغ', 'شكراً لك، سنراجع البلاغ قريباً'),
        },
      ]
    );
  };

  const handleMoreOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'خيارات',
      'اختر إجراء',
      [
        { text: isBlocked ? 'إلغاء الحظر' : 'حظر المستخدم', onPress: handleBlock },
        { text: 'الإبلاغ عن المستخدم', onPress: handleReport, style: 'destructive' },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>الملف الشخصي</Text>
        <TouchableOpacity onPress={handleMoreOptions} style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={[styles.profileHeader, { backgroundColor: COLORS.cardBg }]}
        >
          <LinearGradient
            colors={[COLORS.accent + '40', COLORS.primary + '20']}
            style={styles.profileBanner}
          />
          <View style={styles.profileContent}>
            {user.avatar ? (
              <ExpoImage
                source={{ uri: user.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.avatar}>
                <Ionicons name="person" size={48} color="#FFF" />
              </LinearGradient>
            )}
            <Text style={[styles.name, { color: COLORS.text }]}>{user.name}</Text>
            <Text style={[styles.username, { color: COLORS.textSecondary }]}>{user.username}</Text>
            <Text style={[styles.bio, { color: COLORS.textSecondary }]}>{user.bio}</Text>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: COLORS.text }]}>{user.posts}</Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>منشور</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: COLORS.text }]}>{user.followers}</Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>متابع</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: COLORS.text }]}>{user.following}</Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>يتابع</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleFollow}
                style={[
                  styles.followButton,
                  { backgroundColor: isFollowing ? COLORS.cardBg : COLORS.accent },
                  isFollowing && { borderWidth: 1, borderColor: COLORS.border },
                ]}
              >
                <Ionicons
                  name={isFollowing ? 'checkmark' : 'person-add'}
                  size={20}
                  color={isFollowing ? COLORS.text : '#FFF'}
                />
                <Text
                  style={[
                    styles.followButtonText,
                    { color: isFollowing ? COLORS.text : '#FFF' },
                  ]}
                >
                  {isFollowing ? 'يتابع' : 'متابعة'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* User Posts */}
        <View style={styles.postsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            المنشورات ({userPosts.length})
          </Text>

          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.delay(200 + index * 50).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}
                >
                  <View style={styles.postHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
                      <Text style={[styles.categoryText, { color: COLORS.accent }]}>
                        {post.category}
                      </Text>
                    </View>
                    <Text style={[styles.postDate, { color: COLORS.textSecondary }]}>
                      {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                    </Text>
                  </View>
                  <Text style={[styles.postTitle, { color: COLORS.text }]} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={[styles.postContent, { color: COLORS.textSecondary }]} numberOfLines={2}>
                    {post.content}
                  </Text>
                  {post.image && (
                    <ExpoImage
                      source={{ uri: post.image }}
                      style={styles.postImage}
                      contentFit="cover"
                    />
                  )}
                  <View style={styles.postStats}>
                    <View style={styles.postStat}>
                      <Ionicons name="heart" size={16} color={COLORS.textSecondary} />
                      <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                        {post.likes}
                      </Text>
                    </View>
                    <View style={styles.postStat}>
                      <Ionicons name="chatbubble" size={16} color={COLORS.textSecondary} />
                      <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                        {post.comments}
                      </Text>
                    </View>
                    <View style={styles.postStat}>
                      <Ionicons name="share-social" size={16} color={COLORS.textSecondary} />
                      <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                        {post.shares}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد منشورات</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
  },
  profileHeader: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileBanner: {
    height: 120,
  },
  profileContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: -60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: 12,
    width: '100%',
  },
  followButton: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  postCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
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
  postHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postDate: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  postStats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  postStat: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 13,
    fontFamily: 'Tajawal_500Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
