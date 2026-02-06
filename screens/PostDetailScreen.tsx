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
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PostDetailScreen({ route }: Props) {
  const { postId } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, logout, user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    try {
      setIsLoading(true);
      const [postRes, commentsRes] = await Promise.all([
        api.getPost(postId),
        api.getComments(postId)
      ]);

      if (postRes.success) {
        const mappedPost = {
          ...postRes.data,
          is_liked: !!postRes.data.is_liked,
          is_favorited: !!postRes.data.is_favorited
        };
        setPost(mappedPost);
      }

      if (commentsRes.success) {
        setComments(commentsRes.data);
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      // Don't show alert here to avoid blocking UI on load, 
      // instead we can show error UI or just log it if it's "not found" it will stay null
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
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
            // await logout(); // Usually don't want to logout current session if existing
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };

  const handleLike = async () => {
    if (isGuest) {
      handleGuestAction('إضافة إعجاب');
      return;
    }

    // Optimistic update
    const previousState = { ...post };
    const newLikedState = !post.is_liked;
    const newLikesCount = newLikedState ? post.likes_count + 1 : post.likes_count - 1;

    setPost({
      ...post,
      is_liked: newLikedState,
      likes_count: newLikesCount
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await api.toggleLike(String(post.id));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setPost(previousState);
    }
  };

  const handleFavorite = async () => {
    if (isGuest) {
      handleGuestAction('حفظ المنشور');
      return;
    }

    // Optimistic update
    const previousState = { ...post };
    const newFavState = !post.is_favorited;

    setPost({
      ...post,
      is_favorited: newFavState
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await api.toggleFavorite(String(post.id));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setPost(previousState);
    }
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
    if (isGuest) {
      handleGuestAction('الإبلاغ عن المنشور');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Report', {
      type: 'post',
      id: parseInt(postId),
      title: post.title
    });
  };

  const handleAddComment = async () => {
    if (isGuest) {
      handleGuestAction('إضافة تعليق');
      return;
    }

    if (!comment.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSubmittingComment(true);

    try {
      const response = await api.createComment({
        post_id: parseInt(postId),
        content: comment.trim()
      });

      if (response.success) {
        // Optimistically add comment or refetch
        // Here we'll just refetch for simplicity and correctness (dates, user info etc)
        const commentsRes = await api.getComments(postId);
        if (commentsRes.success) {
          setComments(commentsRes.data);
        }
        setComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('خطأ', 'فشل إضافة التعليق');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentMore = (comment: any) => {
    if (isGuest) {
      handleGuestAction('الإبلاغ عن التعليق');
      return;
    }

    const isOwnComment = user && comment.user_id === user.id;

    if (isOwnComment) {
      Alert.alert(
        'حذف التعليق',
        'هل تريد حقاً حذف هذا التعليق؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'حذف',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await api.deleteComment(String(comment.id));
                if (response.success) {
                  setComments(prev => prev.filter(c => c.id !== comment.id));
                }
              } catch (error) {
                console.error('Error deleting comment:', error);
                Alert.alert('خطأ', 'فشل حذف التعليق');
              }
            }
          }
        ]
      );
    } else {
      navigation.navigate('Report', {
        type: 'comment',
        id: comment.id,
        title: comment.content.substring(0, 20) + '...'
      });
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (!user) return 0;
    if (a.user_id === user.id && b.user_id !== user.id) return -1;
    if (a.user_id !== user.id && b.user_id === user.id) return 1;
    return 0;
  });

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
            onPress={() => handleUserPress(String(post.user_id || post.userId))}
            activeOpacity={0.7}
          >
            <View style={styles.userInfo}>
              {(post.user_image || post.userAvatar) ? (
                <ExpoImage
                  source={{ uri: api.getFileUrl(post.user_image || post.userAvatar) ?? undefined }}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.userAvatar}>
                  <Ionicons name="person" size={20} color="#FFF" />
                </LinearGradient>
              )}
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: COLORS.text }]}>{post.user_name || post.userName}</Text>
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

          {/* Post Video (YouTube) */}
          {post.type === 'video' && post.media_url && getYoutubeId(post.media_url) && (
            <View style={styles.videoContainer}>
              <WebView
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: `https://www.youtube.com/embed/${getYoutubeId(post.media_url)}` }}
              />
            </View>
          )}

          {/* Post Image */}
          {post.type === 'image' && (post.media_url || post.image) && (
            <ExpoImage source={{ uri: api.getFileUrl(post.media_url || post.image) ?? undefined }} style={styles.postImage} contentFit="cover" />
          )}

          {/* Post Link */}
          {post.type === 'link' && (post.link_url || post.link) && (
            <View style={[styles.linkContainer, { backgroundColor: COLORS.background }]}>
              <Ionicons name="link" size={20} color={COLORS.accent} />
              <Text style={[styles.linkText, { color: COLORS.accent }]} numberOfLines={1}>
                {post.link_url || post.link}
              </Text>
            </View>
          )}

          {/* Post Actions */}
          <View style={[styles.postActions, { borderTopColor: COLORS.border }]}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Ionicons
                name={post.is_liked ? 'heart' : 'heart-outline'}
                size={24}
                color={post.is_liked ? '#E94B3C' : COLORS.textSecondary}
              />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.likes_count || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color={COLORS.textSecondary} />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.shares || 0}
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
              <Ionicons
                name={post.is_favorited ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={post.is_favorited ? COLORS.accent : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Comments Section */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.commentsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            التعليقات ({comments.length})
          </Text>

          {sortedComments.map((comment, index) => (
            <View key={comment.id}>
              <Animated.View
                entering={FadeInDown.delay(300 + index * 50).springify()}
                style={[styles.commentCard, { backgroundColor: COLORS.cardBg }]}
              >
                <View style={styles.commentHeaderRow}>
                  <TouchableOpacity
                    style={styles.commentHeader}
                    onPress={() => handleUserPress(String(comment.user_id || comment.userId))}
                    activeOpacity={0.7}
                  >
                    {(comment.user_image || comment.userAvatar) ? (
                      <ExpoImage
                        source={{ uri: api.getFileUrl(comment.user_image || comment.userAvatar) ?? undefined }}
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
                        {comment.user_name || comment.userName}
                      </Text>
                      <Text style={[styles.commentTime, { color: COLORS.textSecondary }]}>
                        {new Date(comment.created_at || comment.createdAt).toLocaleDateString('ar-SA')}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleCommentMore(comment)}
                    style={styles.commentMoreButton}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.commentContent, { color: COLORS.textSecondary }]}>
                  {comment.content}
                </Text>

                {/* Removed comment likes and replies per request */}
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
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  webView: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentMoreButton: {
    padding: 4,
  },
});
