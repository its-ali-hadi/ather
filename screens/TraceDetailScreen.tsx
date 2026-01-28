import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Share,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TraceDetailScreen({ navigation, route }: any) {
  const { trace } = route.params;
  const colorScheme = useColorScheme();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(trace.likes);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#8B7FFF' : '#6C5CE7',
    background: colorScheme === 'dark' ? '#0F0F1E' : '#F8F9FA',
    cardBg: colorScheme === 'dark' ? '#1A1A2E' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#E8E8F0' : '#2D3436',
    textSecondary: colorScheme === 'dark' ? '#A0A0B8' : '#636E72',
  };

  const categoryColors = {
    'فكرة': '#6C5CE7',
    'اقتباس': '#FD79A8',
    'تجربة': '#00B894',
    'نصيحة': '#FDCB6E',
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${trace.title}\n\n${trace.content}\n\n- ${trace.author}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: COLORS.cardBg }]}
          onPress={() => {
            handlePress();
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: COLORS.cardBg }]}
          onPress={() => {
            handlePress();
            handleShare();
          }}
        >
          <Ionicons name="share-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Category Badge */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.categorySection}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColors[trace.category] + '20' },
            ]}
          >
            <View
              style={[styles.categoryDot, { backgroundColor: categoryColors[trace.category] }]}
            />
            <Text style={[styles.categoryText, { color: categoryColors[trace.category] }]}>
              {trace.category}
            </Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <Text style={[styles.title, { color: COLORS.text }]}>{trace.title}</Text>
        </Animated.View>

        {/* Author Info */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <View style={[styles.authorAvatar, { backgroundColor: COLORS.primary + '30' }]}>
              <Text style={[styles.authorInitial, { color: COLORS.primary }]}>
                {trace.author.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={[styles.authorName, { color: COLORS.text }]}>{trace.author}</Text>
              <Text style={[styles.dateText, { color: COLORS.textSecondary }]}>
                منذ ساعتين
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Content Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <View style={[styles.contentCard, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(139, 127, 255, 0.05)', 'rgba(26, 26, 46, 0.98)']
                  : ['rgba(108, 92, 231, 0.03)', 'rgba(255, 255, 255, 0.98)']
              }
              style={styles.contentGradient}
            >
              <Text style={[styles.content, { color: COLORS.text }]}>{trace.content}</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Stats & Actions */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.actionsSection}>
          <View style={[styles.statsCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={20} color="#FD79A8" />
                <Text style={[styles.statText, { color: COLORS.text }]}>{likes} إعجاب</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
                <Text style={[styles.statText, { color: COLORS.text }]}>
                  {trace.comments} تعليق
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={20} color="#00B894" />
                <Text style={[styles.statText, { color: COLORS.text }]}>234 مشاهدة</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Comments Section */}
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.commentsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>التعليقات</Text>
          <View style={[styles.commentCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.commentHeader}>
              <View style={[styles.commentAvatar, { backgroundColor: '#00B894' + '30' }]}>
                <Text style={[styles.commentInitial, { color: '#00B894' }]}>م</Text>
              </View>
              <View style={styles.commentInfo}>
                <Text style={[styles.commentAuthor, { color: COLORS.text }]}>محمد أحمد</Text>
                <Text style={[styles.commentDate, { color: COLORS.textSecondary }]}>
                  منذ ساعة
                </Text>
              </View>
            </View>
            <Text style={[styles.commentText, { color: COLORS.textSecondary }]}>
              كلام رائع ومُلهم! شكراً على المشاركة 🌟
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.bottomActions}>
        <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.actionsBlur}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isLiked ? '#FD79A8' : COLORS.cardBg }]}
            onPress={handleLike}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? '#FFF' : COLORS.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.cardBg }]}
            onPress={handlePress}
          >
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentInputButton} onPress={handlePress}>
            <LinearGradient
              colors={['#6C5CE7', '#A29BFE']}
              style={styles.commentInputGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.commentInputText}>اكتب تعليقاً...</Text>
              <Ionicons name="send" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categorySection: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 42,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  authorSection: {
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: 'Inter_600SemiBold',
  },
  dateText: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  contentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  contentGradient: {
    padding: 24,
  },
  content: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  actionsSection: {
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  commentsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  commentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
  commentInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  commentDate: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionsBlur: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInputButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  commentInputGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  commentInputText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
});