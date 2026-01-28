import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mockTraces, Trace } from '../data/mockTraces';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function HomeScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [traces, setTraces] = useState<Trace[]>(mockTraces);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#8B7FFF' : '#6C5CE7',
    secondary: colorScheme === 'dark' ? '#A29BFE' : '#A29BFE',
    accent: '#FD79A8',
    background: colorScheme === 'dark' ? '#0F0F1E' : '#F8F9FA',
    cardBg: colorScheme === 'dark' ? '#1A1A2E' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#E8E8F0' : '#2D3436',
    textSecondary: colorScheme === 'dark' ? '#A0A0B8' : '#636E72',
    border: colorScheme === 'dark' ? '#2D2D44' : '#E8E8F0',
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

  const formatDate = (date: Date) => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${days[date.getDay()]}، ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#1A1A2E', '#0F0F1E'] : ['#6C5CE7', '#A29BFE']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: '#FFF' }]}>مرحباً بك 👋</Text>
              <Text style={[styles.headerTitle, { color: '#FFF' }]}>اترك أثرك اليوم</Text>
            </View>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={handlePress}
            >
              <Ionicons name="person" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>آثارك</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>إعجاب</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>تعليق</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Week Calendar */}
        <Animated.View entering={FadeInRight.delay(200).springify()} style={styles.calendarSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>اختر التاريخ</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
          >
            {getWeekDates().map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedDate(date);
                    handlePress();
                  }}
                  style={[
                    styles.dateCard,
                    {
                      backgroundColor: isSelected ? COLORS.primary : COLORS.cardBg,
                      borderColor: isToday ? COLORS.accent : COLORS.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      { color: isSelected ? '#FFF' : COLORS.textSecondary },
                    ]}
                  >
                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'][date.getDay()]}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      { color: isSelected ? '#FFF' : COLORS.text },
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  {isToday && (
                    <View style={[styles.todayDot, { backgroundColor: COLORS.accent }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Selected Date Info */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.dateInfoSection}>
          <View style={[styles.dateInfoCard, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(139, 127, 255, 0.1)', 'rgba(162, 155, 254, 0.05)']
                  : ['rgba(108, 92, 231, 0.08)', 'rgba(255, 255, 255, 0.95)']
              }
              style={styles.dateInfoGradient}
            >
              <View style={styles.dateInfoContent}>
                <View style={[styles.calendarIcon, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="calendar" size={24} color="#FFF" />
                </View>
                <View style={styles.dateInfoText}>
                  <Text style={[styles.dateInfoTitle, { color: COLORS.text }]}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Text style={[styles.dateInfoSubtitle, { color: COLORS.textSecondary }]}>
                    {traces.length} أثر في هذا اليوم
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Traces List */}
        <View style={styles.tracesSection}>
          <View style={styles.tracesSectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>الآثار المشاركة</Text>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: COLORS.cardBg }]}
              onPress={handlePress}
            >
              <Ionicons name="filter" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {traces.map((trace, index) => (
            <Animated.View
              key={trace.id}
              entering={FadeInUp.delay(400 + index * 100).springify()}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  handlePress();
                  navigation.navigate('TraceDetail', { trace });
                }}
              >
                <View style={[styles.traceCard, { backgroundColor: COLORS.cardBg }]}>
                  <LinearGradient
                    colors={
                      colorScheme === 'dark'
                        ? ['rgba(26, 26, 46, 0.98)', 'rgba(15, 15, 30, 0.95)']
                        : ['rgba(255, 255, 255, 0.98)', 'rgba(248, 249, 250, 0.95)']
                    }
                    style={styles.traceCardGradient}
                  >
                    {/* Category Badge */}
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryColors[trace.category] + '20' },
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: categoryColors[trace.category] },
                        ]}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          { color: categoryColors[trace.category] },
                        ]}
                      >
                        {trace.category}
                      </Text>
                    </View>

                    {/* Trace Content */}
                    <Text style={[styles.traceTitle, { color: COLORS.text }]}>
                      {trace.title}
                    </Text>
                    <Text
                      style={[styles.traceContent, { color: COLORS.textSecondary }]}
                      numberOfLines={3}
                    >
                      {trace.content}
                    </Text>

                    {/* Author & Stats */}
                    <View style={styles.traceFooter}>
                      <View style={styles.authorInfo}>
                        <View
                          style={[
                            styles.authorAvatar,
                            { backgroundColor: COLORS.primary + '30' },
                          ]}
                        >
                          <Text style={[styles.authorInitial, { color: COLORS.primary }]}>
                            {trace.author.charAt(0)}
                          </Text>
                        </View>
                        <Text style={[styles.authorName, { color: COLORS.text }]}>
                          {trace.author}
                        </Text>
                      </View>

                      <View style={styles.traceStats}>
                        <View style={styles.statGroup}>
                          <Ionicons name="heart-outline" size={18} color={COLORS.textSecondary} />
                          <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                            {trace.likes}
                          </Text>
                        </View>
                        <View style={styles.statGroup}>
                          <Ionicons
                            name="chatbubble-outline"
                            size={18}
                            color={COLORS.textSecondary}
                          />
                          <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                            {trace.comments}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          handlePress();
          navigation.navigate('CreateTrace');
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  calendarSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  calendarContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  dateCard: {
    width: 64,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
  dateDay: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  dateInfoSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  dateInfoCard: {
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
  dateInfoGradient: {
    padding: 20,
  },
  dateInfoContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  calendarIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfoText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  dateInfoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  tracesSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  tracesSectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  traceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
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
  traceCardGradient: {
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  traceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  traceContent: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  traceFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  authorInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  traceStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabGradient: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
});