import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import SeedData from '../constants/seed-data.json';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock comments data
const mockComments = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'أحمد محمد',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    content: 'منشور رائع! استفدت كثيراً من المعلومات المشاركة هنا.',
    likes: 12,
    isLiked: false,
    createdAt: '2024-01-15T11:30:00Z',
    replies: [
      {
        id: 'r1',
        userId: 'user-2',
        userName: 'سارة أحمد',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        content: 'أتفق معك تماماً!',
        likes: 3,
        isLiked: false,
        createdAt: '2024-01-15T12:00:00Z',
      },
    ],
  },
  {
    id: '2',
    userId: 'user-3',
    userName: 'محمد علي',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'هل يمكنك مشاركة المزيد من التفاصيل؟',
    likes: 8,
    isLiked: true,
    createdAt: '2024-01-15T13:45:00Z',
    replies: [],
  },
  {
    id: '3',
    userId: 'user-4',
    userName: 'فاطمة خالد',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    content: 'شكراً على المشاركة! محتوى قيم جداً 🌟',
    likes: 15,
    isLiked: false,
    createdAt: '2024-01-15T14:20:00Z',
    replies: [],
  },
];

export default function PostDetailScreen({ route }: Props) {
  const { postId } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, logout } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockComments);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
    inputBg: colorScheme === 'dark' ? 'rgba(42, 36, 32, 0.5)' : 'rgba(255, 255, 255, 0.8)',
  };

  // Get post data
  const post = SeedData.posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <Text style={[styles.errorText, { color: COLORS.text }]}>المنشور غير موجود</Text>
      </SafeAreaView>
    );
  }

  const handleUserPress = (userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('UserProfile', { userId });
  };

  const handleGuestAction = async (actionName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'تسجيل الدخول مطلوب',
      `يجب عليك تسجيل الدخول لـ${actionName}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الدخول',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleLike = () => {
    if (isGuest) {
      handleGuestAction('إضافة إعجاب');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement like functionality
  };

  const handleFavorite = () => {
    if (isGuest) {
      handleGuestAction('حفظ المنشور');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement favorite functionality
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content}`,
        title: post.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'الإبلاغ عن المنشور',
      'هل تريد الإبلاغ عن هذا المنشور؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إبلاغ',
          style: 'destructive',
          onPress: () => Alert.alert('تم الإبلاغ', 'شكراً لك، سنراجع المنشور قريباً'),
        },
      ]
    );
  };

  const handleAddComment = () => {
    if (isGuest) {
      handleGuestAction('إضافة تعليق');
      return;
    }
    
    if (!comment.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'أنت',
      userAvatar: null,
      content: comment,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    
    setComments([newComment, ...comments]);
    setComment('');
  };

  const handleCommentLike = (commentId: string) => {
    if (isGuest) {
      handleGuestAction('إضافة إعجاب على التعليق');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement comment like functionality
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>تفاصيل المنشور</Text>
        <TouchableOpacity onPress={handleReport} style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Post Content */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}
        >
          {/* Post Header */}
          <TouchableOpacity 
            style={styles.postHeader}
            onPress={() => handleUserPress(post.userId)}
            activeOpacity={0.7}
          >
            <View style={styles.userInfo}>
              {post.userAvatar ? (
                <ExpoImage
                  source={{ uri: post.userAvatar }}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.userAvatar}>
                  <Ionicons name="person" size={20} color="#FFF" />
                </LinearGradient>
              )}
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: COLORS.text }]}>{post.userName}</Text>
                <Text style={[styles.postTime, { color: COLORS.textSecondary }]}>
                  {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
              <Text style={[styles.categoryText, { color: COLORS.accent }]}>{post.category}</Text>
            </View>
          </TouchableOpacity>

          {/* Post Title & Content */}
          <View style={styles.postContent}>
            <Text style={[styles.postTitle, { color: COLORS.text }]}>{post.title}</Text>
            <Text style={[styles.postDescription, { color: COLORS.textSecondary }]}>
              {post.content}
            </Text>
          </View>

          {/* Post Image */}
          {post.image && (
            <ExpoImage source={{ uri: post.image }} style={styles.postImage} contentFit="cover" />
          )}

          {/* Post Link */}
          {post.link && (
            <View style={[styles.linkContainer, { backgroundColor: COLORS.background }]}>
              <Ionicons name="link" size={20} color={COLORS.accent} />
              <Text style={[styles.linkText, { color: COLORS.accent }]} numberOfLines={1}>
                {post.link}
              </Text>
            </View>
          )}

          {/* Post Actions */}
          <View style={[styles.postActions, { borderTopColor: COLORS.border }]}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={post.isLiked ? '#E94B3C' : COLORS.textSecondary}
              />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color={COLORS.textSecondary} />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {comments.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color={COLORS.textSecondary} />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.shares}
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
              <Ionicons
                name={post.isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={post.isFavorite ? COLORS.accent : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Comments Section */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.commentsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            التعليقات ({comments.length})
          </Text>

          {comments.map((comment, index) => (
            <View key={comment.id}>
              <Animated.View
                entering={FadeInDown.delay(300 + index * 50).springify()}
                style={[styles.commentCard, { backgroundColor: COLORS.cardBg }]}
              >
                <TouchableOpacity 
                  style={styles.commentHeader}
                  onPress={() => handleUserPress(comment.userId)}
                  activeOpacity={0.7}
                >
                  {comment.userAvatar ? (
                    <ExpoImage
                      source={{ uri: comment.userAvatar }}
                      style={styles.commentAvatar}
                      contentFit="cover"
                    />
                  ) : (
                    <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.commentAvatar}>
                      <Ionicons name="person" size={16} color="#FFF" />
                    </LinearGradient>
                  )}
                  <View style={styles.commentInfo}>
                    <Text style={[styles.commentUserName, { color: COLORS.text }]}>
                      {comment.userName}
                    </Text>
                    <Text style={[styles.commentTime, { color: COLORS.textSecondary }]}>
                      {new Date(comment.createdAt).toLocaleDateString('ar-SA')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text style={[styles.commentContent, { color: COLORS.textSecondary }]}>
                  {comment.content}
                </Text>

                <View style={styles.commentActions}>
                  <TouchableOpacity
                    onPress={() => handleCommentLike(comment.id)}
                    style={styles.commentActionButton}
                  >
                    <Ionicons
                      name={comment.isLiked ? 'heart' : 'heart-outline'}
                      size={18}
                      color={comment.isLiked ? '#E94B3C' : COLORS.textSecondary}
                    />
                    <Text style={[styles.commentActionText, { color: COLORS.textSecondary }]}>
                      {comment.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.commentActionButton}>
                    <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={[styles.commentActionText, { color: COLORS.textSecondary }]}>
                      رد
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyCard}>
                        <TouchableOpacity 
                          style={styles.commentHeader}
                          onPress={() => handleUserPress(reply.userId)}
                          activeOpacity={0.7}
                        >
                          {reply.userAvatar ? (
                            <ExpoImage
                              source={{ uri: reply.userAvatar }}
                              style={styles.replyAvatar}
                              contentFit="cover"
                            />
                          ) : (
                            <LinearGradient
                              colors={['#E8B86D', '#D4A574']}
                              style={styles.replyAvatar}
                            >
                              <Ionicons name="person" size={12} color="#FFF" />
                            </LinearGradient>
                          )}
                          <View style={styles.commentInfo}>
                            <Text style={[styles.replyUserName, { color: COLORS.text }]}>
                              {reply.userName}
                            </Text>
                            <Text style={[styles.replyTime, { color: COLORS.textSecondary }]}>
                              {new Date(reply.createdAt).toLocaleDateString('ar-SA')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <Text style={[styles.replyContent, { color: COLORS.textSecondary }]}>
                          {reply.content}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Animated.View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Add Comment Input */}
      <View style={[styles.commentInputContainer, { backgroundColor: COLORS.cardBg, borderTopColor: COLORS.border }]}>
        <TextInput
          style={[styles.commentInput, { backgroundColor: COLORS.inputBg, color: COLORS.text }]}
          placeholder="اكتب تعليقك..."
          placeholderTextColor={COLORS.textSecondary}
          value={comment}
          onChangeText={setComment}
          multiline
          textAlign="right"
        />
        <TouchableOpacity
          onPress={handleAddComment}
          style={[styles.sendButton, { backgroundColor: COLORS.accent }]}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
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
  errorText: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
    marginTop: 40,
  },
  postCard: {
    marginHorizontal: 24,
    marginTop: 8,
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
  postHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  postTime: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    lineHeight: 34,
  },
  postDescription: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 28,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  commentsSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  commentCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  commentHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  commentContent: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  commentActionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 13,
    fontFamily: 'Tajawal_500Medium',
  },
  repliesContainer: {
    marginTop: 12,
    marginRight: 46,
    gap: 8,
  },
  replyCard: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  replyTime: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  replyContent: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 22,
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
