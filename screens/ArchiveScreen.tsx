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
import { useState } from 'react';

// Mock archived posts
const mockArchivedPosts = [
  {
    id: 'archived-1',
    userId: 'current-user',
    userName: 'أنت',
    userAvatar: null,
    type: 'text',
    title: 'منشور قديم عن البرمجة',
    content: 'هذا منشور قديم قمت بأرشفته لأنه لم يعد ذو صلة...',
    likes: 45,
    comments: 12,
    shares: 5,
    createdAt: '2023-11-10T10:30:00Z',
    archivedAt: '2024-01-10T14:20:00Z',
    category: 'تقنية',
  },
  {
    id: 'archived-2',
    userId: 'current-user',
    userName: 'أنت',
    userAvatar: null,
    type: 'image',
    title: 'صورة من رحلة قديمة',
    content: 'ذكريات جميلة من رحلة العام الماضي',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    likes: 89,
    comments: 23,
    shares: 15,
    createdAt: '2023-10-15T09:15:00Z',
    archivedAt: '2024-01-08T11:30:00Z',
    category: 'سفر',
  },
];

export default function ArchiveScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [archivedPosts, setArchivedPosts] = useState(mockArchivedPosts);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const handleUnarchive = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'إلغاء الأرشفة',
      'هل تريد إعادة هذا المنشور إلى ملفك الشخصي؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة',
          onPress: () => {
            setArchivedPosts(archivedPosts.filter((p) => p.id !== postId));
            Alert.alert('تم', 'تم إعادة المنشور إلى ملفك الشخصي');
          },
        },
      ]
    );
  };

  const handleDeletePermanently = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'حذف نهائي',
      'هل أنت متأكد من حذف هذا المنشور نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف نهائياً',
          style: 'destructive',
          onPress: () => {
            setArchivedPosts(archivedPosts.filter((p) => p.id !== postId));
            Alert.alert('تم الحذف', 'تم حذف المنشور نهائياً');
          },
        },
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
        <View style={styles.headerContent}>
          <LinearGradient colors={['#95A5A6', '#7F8C8D']} style={styles.headerIcon}>
            <Ionicons name="archive" size={28} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>الأرشيف</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={[styles.infoBannerContent, { backgroundColor: COLORS.accent + '15' }]}>
            <Ionicons name="information-circle" size={20} color={COLORS.accent} />
            <Text style={[styles.infoBannerText, { color: COLORS.text }]}>
              المنشورات المؤرشفة مخفية من ملفك الشخصي
            </Text>
          </View>
        </View>

        {/* Archived Posts */}
        <View style={styles.postsContainer}>
          {archivedPosts.length > 0 ? (
            archivedPosts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.delay(100 + index * 50).springify()}
              >
                <View style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}>
                  {/* Archive Badge */}
                  <View style={[styles.archiveBadge, { backgroundColor: COLORS.accent + '20' }]}>
                    <Ionicons name="archive" size={14} color={COLORS.accent} />
                    <Text style={[styles.archiveBadgeText, { color: COLORS.accent }]}>
                      مؤرشف في {new Date(post.archivedAt).toLocaleDateString('ar-SA')}
                    </Text>
                  </View>

                  {/* Post Header */}
                  <View style={styles.postHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: COLORS.primary + '20' }]}>
                      <Text style={[styles.categoryText, { color: COLORS.primary }]}>
                        {post.category}
                      </Text>
                    </View>
                    <Text style={[styles.postDate, { color: COLORS.textSecondary }]}>
                      {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                    </Text>
                  </View>

                  {/* Post Content */}
                  <Text style={[styles.postTitle, { color: COLORS.text }]} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={[styles.postContent, { color: COLORS.textSecondary }]} numberOfLines={2}>
                    {post.content}
                  </Text>

                  {/* Post Image */}
                  {post.image && (
                    <ExpoImage
                      source={{ uri: post.image }}
                      style={styles.postImage}
                      contentFit="cover"
                    />
                  )}

                  {/* Post Stats */}
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

                  {/* Actions */}
                  <View style={[styles.postActions, { borderTopColor: COLORS.border }]}>
                    <TouchableOpacity
                      onPress={() => handleUnarchive(post.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="arrow-undo-outline" size={20} color={COLORS.accent} />
                      <Text style={[styles.actionText, { color: COLORS.accent }]}>
                        إلغاء الأرشفة
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeletePermanently(post.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#E94B3C" />
                      <Text style={[styles.actionText, { color: '#E94B3C' }]}>حذف نهائياً</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="archive-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد منشورات مؤرشفة</Text>
              <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                المنشورات التي تقوم بأرشفتها ستظهر هنا
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  infoBanner: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  infoBannerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  postsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  postCard: {
    padding: 16,
    borderRadius: 16,
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
  archiveBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  archiveBadgeText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
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
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
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
    textAlign: 'center',
  },
});