import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateTraceScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('فكرة');

  const COLORS = {
    primary: colorScheme === 'dark' ? '#8B7FFF' : '#6C5CE7',
    background: colorScheme === 'dark' ? '#0F0F1E' : '#F8F9FA',
    cardBg: colorScheme === 'dark' ? '#1A1A2E' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#E8E8F0' : '#2D3436',
    textSecondary: colorScheme === 'dark' ? '#A0A0B8' : '#636E72',
    border: colorScheme === 'dark' ? '#2D2D44' : '#E8E8F0',
  };

  const categories = [
    { id: 'فكرة', icon: 'bulb', color: '#6C5CE7' },
    { id: 'اقتباس', icon: 'quote', color: '#FD79A8' },
    { id: 'تجربة', icon: 'flask', color: '#00B894' },
    { id: 'نصيحة', icon: 'star', color: '#FDCB6E' },
  ];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: COLORS.cardBg }]}
            onPress={() => {
              handlePress();
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>أثر جديد</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Category Selection */}
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>اختر التصنيف</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      handlePress();
                    }}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected ? category.color + '20' : COLORS.cardBg,
                        borderColor: isSelected ? category.color : COLORS.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: isSelected ? category.color : COLORS.border },
                      ]}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={24}
                        color={isSelected ? '#FFF' : COLORS.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: isSelected ? category.color : COLORS.textSecondary },
                      ]}
                    >
                      {category.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Title Input */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>العنوان</Text>
            <View style={[styles.inputCard, { backgroundColor: COLORS.cardBg }]}>
              <TextInput
                style={[styles.titleInput, { color: COLORS.text }]}
                placeholder="اكتب عنواناً مميزاً..."
                placeholderTextColor={COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
                textAlign="right"
              />
            </View>
          </Animated.View>

          {/* Content Input */}
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>المحتوى</Text>
            <View style={[styles.inputCard, { backgroundColor: COLORS.cardBg }]}>
              <TextInput
                style={[styles.contentInput, { color: COLORS.text }]}
                placeholder="شارك فكرتك، تجربتك، أو نصيحتك..."
                placeholderTextColor={COLORS.textSecondary}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={8}
                textAlign="right"
                textAlignVertical="top"
              />
            </View>
            <Text style={[styles.charCount, { color: COLORS.textSecondary }]}>
              {content.length} / 500 حرف
            </Text>
          </Animated.View>

          {/* Tips Card */}
          <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.section}>
            <View style={[styles.tipsCard, { backgroundColor: COLORS.primary + '15' }]}>
              <View style={[styles.tipsIcon, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="information" size={20} color="#FFF" />
              </View>
              <View style={styles.tipsContent}>
                <Text style={[styles.tipsTitle, { color: COLORS.primary }]}>نصائح للكتابة</Text>
                <Text style={[styles.tipsText, { color: COLORS.textSecondary }]}>
                  • كن صادقاً ومباشراً{'\n'}
                  • شارك تجربة حقيقية{'\n'}
                  • اجعل رسالتك ملهمة
                </Text>
              </View>
            </View>
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.9}
            disabled={!title.trim() || !content.trim()}
          >
            <LinearGradient
              colors={
                title.trim() && content.trim()
                  ? ['#6C5CE7', '#A29BFE']
                  : ['#A0A0B8', '#636E72']
              }
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.submitText}>نشر الأثر</Text>
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Inter_600SemiBold',
  },
  categoriesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  inputCard: {
    borderRadius: 16,
    padding: 16,
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
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 160,
    fontFamily: 'Inter_400Regular',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'left',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  tipsCard: {
    flexDirection: 'row-reverse',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  tipsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'Inter_600SemiBold',
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  submitText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
});