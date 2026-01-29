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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

// Mock drafts data
const mockDrafts = [
  {
    id: 'draft-1',
    type: 'text',
    title: 'أفكار حول تطوير التطبيقات',
    content: 'بدأت أفكر في كيفية تحسين تجربة المستخدم في التطبيقات...',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: 'draft-2',
    type: 'image',
    title: 'لوحة جديدة',
    content: 'لوحة لم أكملها بعد، أحتاج لإضافة بعض التفاصيل',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
  },
  {
    id: 'draft-3',
    type: 'text',
    title: 'قصة قصيرة - مسودة',
    content: 'كان الليل هادئاً، والنجوم تتلألأ في السماء...',
    createdAt: '2024-01-13T20:00:00Z',
    updatedAt: '2024-01-13T22:45:00Z',
  },
];

export default function PrivateScreen() {
  const colorScheme = useColorScheme();
  const [drafts, setDrafts] = useState(mockDrafts);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const handleEditDraft = (draftId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to edit screen
    Alert.alert('تعديل المسودة', 'سيتم فتح المسودة للتعديل');
  };

  const handleDeleteDraft = (draftId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'حذف المسودة',
      'هل أنت متأكد من حذف هذه المسودة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            setDrafts(drafts.filter((d) => d.id !== draftId));
            Alert.alert('تم الحذف', 'تم حذف المسودة بنجاح');
          },
        },
      ]
    );
  };

  const handlePublishDraft = (draftId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'نشر المسودة',
      'هل تريد نشر هذه المسودة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نشر',
          onPress: () => {
            Alert.alert('تم النشر', 'تم نشر المسودة بنجاح');
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return 'document-text';
      case 'image':
        return 'image';
      case 'video':
        return 'videocam';
      case 'link':
        return 'link';
      default:
        return 'document';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="document-text" size={40} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: COLORS.text }]}>المسودات</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            منشوراتك غير المنشورة ({drafts.length})
          </Text>
        </Animated.View>

        {/* Drafts List */}
        {drafts.length > 0 ? (
          <View style={styles.draftsContainer}>
            {drafts.map((draft, index) => (
              <Animated.View
                key={draft.id}
                entering={FadeInUp.delay(200 + index * 80).springify()}
              >
                <View style={[styles.draftCard, { backgroundColor: COLORS.cardBg }]}>
                  {/* Draft Header */}
                  <View style={styles.draftHeader}>
                    <View style={styles.draftTypeContainer}>
                      <View style={[styles.typeIcon, { backgroundColor: COLORS.accent + '20' }]}>
                        <Ionicons name={getTypeIcon(draft.type) as any} size={20} color={COLORS.accent} />
                      </View>
                      <View style={styles.draftInfo}>
                        <Text style={[styles.draftTitle, { color: COLORS.text }]} numberOfLines={1}>
                          {draft.title}
                        </Text>
                        <Text style={[styles.draftDate, { color: COLORS.textSecondary }]}>
                          آخر تعديل: {new Date(draft.updatedAt).toLocaleDateString('ar-SA')}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Draft Content */}
                  <Text style={[styles.draftContent, { color: COLORS.textSecondary }]} numberOfLines={2}>
                    {draft.content}
                  </Text>

                  {/* Draft Image */}
                  {draft.image && (
                    <ExpoImage
                      source={{ uri: draft.image }}
                      style={styles.draftImage}
                      contentFit="cover"
                    />
                  )}

                  {/* Draft Actions */}
                  <View style={[styles.draftActions, { borderTopColor: COLORS.border }]}>
                    <TouchableOpacity
                      onPress={() => handleEditDraft(draft.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="create-outline" size={20} color={COLORS.accent} />
                      <Text style={[styles.actionText, { color: COLORS.accent }]}>تعديل</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handlePublishDraft(draft.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="send-outline" size={20} color="#4CAF50" />
                      <Text style={[styles.actionText, { color: '#4CAF50' }]}>نشر</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteDraft(draft.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#E94B3C" />
                      <Text style={[styles.actionText, { color: '#E94B3C' }]}>حذف</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.emptyContainer}>
            <View style={[styles.emptyCard, { backgroundColor: COLORS.cardBg }]}>
              <LinearGradient
                colors={[COLORS.primary + '20', COLORS.accent + '10']}
                style={styles.emptyIconBg}
              >
                <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
              </LinearGradient>
              <Text style={[styles.emptyTitle, { color: COLORS.text }]}>
                لا توجد مسودات بعد
              </Text>
              <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                المنشورات التي تحفظها كمسودات ستظهر هنا
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Info Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.infoContainer}>
          <View style={[styles.infoCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={COLORS.accent} />
              <Text style={[styles.infoTitle, { color: COLORS.text }]}>
                عن المسودات
              </Text>
            </View>
            <Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
              المسودات هي منشورات لم تنشرها بعد. يمكنك حفظ أفكارك ومنشوراتك كمسودات
              والعودة لتعديلها ونشرها لاحقاً. المسودات خاصة بك فقط ولا يمكن لأحد رؤيتها.
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 20 }} />
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
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#9B59B6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  draftsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  draftCard: {
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
  draftHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  draftTypeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftInfo: {
    flex: 1,
    gap: 4,
  },
  draftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  draftDate: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  draftContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 24,
  },
  draftImage: {
    width: '100%',
    height: 180,
    marginBottom: 12,
  },
  draftActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
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
    paddingHorizontal: 24,
  },
  emptyCard: {
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
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
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  infoCard: {
    padding: 24,
    borderRadius: 20,
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
  infoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});