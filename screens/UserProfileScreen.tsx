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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

import SeedData from '../constants/seed-data.json';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UserProfileScreen({ route }: Props) {
  const { userId } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const { isGuest, user: currentUser } = useAuth();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  // State for user data
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.getUserProfile(userId);
      if (response.success) {
        // Map API response to match UI fields
        const userData = response.data;
        setUser({
          id: userData.id,
          name: userData.name,
          username: '@' + (userData.name ? userData.name.replace(/\s+/g, '').toLowerCase() : 'user'),
          bio: userData.bio || 'لا توجد نبذة',
          avatar: api.getFileUrl(userData.profile_image),
          posts: userData.posts_count || 0,
          followers: userData.followers_count || 0,
          following: userData.following_count || 0,
          isFollowing: userData.is_following,
        });
        setIsFollowing(!!userData.is_following);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await api.getUserPosts(userId);
      if (response.success) {
        // Map API posts to UI
        const mappedPosts = response.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          image: api.getFileUrl(post.media_url),
          category: post.category,
          likes: post.likes_count,
          comments: post.comments_count,
          shares: 0,
          createdAt: post.created_at,
        }));
        setUserPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // If user not found, show error
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>الملف الشخصي</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color={COLORS.textSecondary} />
          <Text style={[styles.emptyText, { color: COLORS.text }]}>المستخدم غير موجود</Text>
        </View>
      </SafeAreaView>
    );
  }


  const handleFollow = async () => {
    if (isGuest) {
      Alert.alert('تنبيه', 'يجب عليك تسجيل الدخول للمتابعة');
      return;
    }

    if (currentUser?.id === parseInt(userId)) {
      Alert.alert('تنبيه', 'لا يمكنك متابعة نفسك');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const originalState = isFollowing;

    // Optimistic update
    setIsFollowing(!isFollowing);
    setUser((prev: any) => prev ? {
      ...prev,
      followers: originalState ? prev.followers - 1 : prev.followers + 1
    } : null);

    try {
      if (originalState) {
        await api.unfollowUser(userId);
      } else {
        await api.followUser(userId);
      }
    } catch (error) {
      console.error('Follow error:', error);
      // Revert if error
      setIsFollowing(originalState);
      setUser((prev: any) => prev ? {
        ...prev,
        followers: originalState ? prev.followers + 1 : prev.followers - 1
      } : null);
      Alert.alert('خطأ', 'فشل تنفيذ الطلب، يرجى المحاولة لاحقاً');
    }
  };

  const handlePostPress = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PostDetail', { postId });
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
    navigation.navigate('Report', {
      type: 'user',
      id: parseInt(userId),
      title: user.name
    });
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
                  onPress={() => handlePostPress(post.id)}
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
