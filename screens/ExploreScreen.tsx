import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const categories = [
    { id: '1', name: 'تقنية', icon: 'code-slash', color: '#4A90E2' },
    { id: '2', name: 'فن', icon: 'color-palette', color: '#E94B3C' },
    { id: '3', name: 'أدب', icon: 'book', color: '#50C878' },
    { id: '4', name: 'رياضة', icon: 'fitness', color: '#F39C12' },
    { id: '5', name: 'سفر', icon: 'airplane', color: '#9B59B6' },
    { id: '6', name: 'أعمال', icon: 'briefcase', color: '#34495E' },
  ];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Text style={[styles.title, { color: COLORS.text }]}>استكشف</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            اكتشف محتوى جديد ومثير
          </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: COLORS.cardBg }]}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: COLORS.text }]}
              placeholder="ابحث عن صناديق أو منشورات..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>التصنيفات</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInUp.delay(300 + index * 80).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePress}
                  style={[styles.categoryCard, { backgroundColor: COLORS.cardBg }]}
                >
                  <LinearGradient
                    colors={[category.color, category.color + 'CC']}
                    style={styles.categoryIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={category.icon as any} size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={[styles.categoryName, { color: COLORS.text }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>الأكثر رواجاً</Text>
            <Ionicons name="flame" size={24} color={COLORS.accent} />
          </View>
          <View style={[styles.placeholderCard, { backgroundColor: COLORS.cardBg }]}>
            <Ionicons name="trending-up" size={48} color={COLORS.textSecondary} />
            <Text style={[styles.placeholderText, { color: COLORS.textSecondary }]}>
              قريباً...
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: 110,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
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
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  placeholderCard: {
    padding: 48,
    borderRadius: 20,
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
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
});