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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';

import SeedData from '../constants/seed-data.json';

type SearchTab = 'posts' | 'users' | 'boxes';

export default function AdvancedSearchScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<SearchTab>('posts');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const categories = ['تقنية', 'فن', 'أدب', 'رياضة', 'سفر', 'أعمال'];

  const mockUsers = [
    {
      id: 'user-1',
      name: 'أحمد محمد',
      username: '@ahmed_dev',
      avatar: 'https://i.pravatar.cc/150?img=11',
      bio: 'مطور تطبيقات | مهتم بالتقنية',
      followers: 1234,
    },
    {
      id: 'user-2',
      name: 'سارة الفنانة',
      username: '@sara_art',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'فنانة تشكيلية | أحب الألوان المائية',
      followers: 5678,
    },
  ];

  const filteredPosts = SeedData.posts.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const filteredBoxes = SeedData.cards.filter((box) =>
    box.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    box.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabPress = (tab: SearchTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const handleCategoryPress = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>البحث المتقدم</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: COLORS.inputBg }]}>
          <Ionicons name="search" size={22} color={COLORS.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: COLORS.text }]}
            placeholder="ابحث عن أي شيء..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          <TouchableOpacity
            onPress={() => handleTabPress('posts')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'posts' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="document-text"
              size={18}
              color={selectedTab === 'posts' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'posts' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              المنشورات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('users')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'users' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="people"
              size={18}
              color={selectedTab === 'users' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'users' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              المستخدمون
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('boxes')}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === 'boxes' ? COLORS.accent : COLORS.cardBg },
            ]}
          >
            <Ionicons
              name="cube"
              size={18}
              color={selectedTab === 'boxes' ? '#FFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'boxes' ? '#FFF' : COLORS.textSecondary },
              ]}
            >
              الصناديق
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Category Filter (for posts only) */}
      {selectedTab === 'posts' && (
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryPress(category)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === category ? COLORS.accent : COLORS.cardBg,
                    borderColor: COLORS.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: selectedCategory === category ? '#FFF' : COLORS.textSecondary },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        <View style={styles.resultsContainer}>
          {/* Posts Results */}
          {selectedTab === 'posts' && (
            <>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <Animated.View
                    key={post.id}
                    entering={FadeInDown.delay(100 + index * 50).springify()}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}
                    >
                      <View style={styles.postHeader}>
                        {post.userAvatar ? (
                          <ExpoImage
                            source={{ uri: post.userAvatar }}
                            style={styles.postAvatar}
                            contentFit="cover"
                          />
                        ) : (
                          <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.postAvatar}>
                            <Ionicons name="person" size={16} color="#FFF" />
                          </LinearGradient>
                        )}
                        <View style={styles.postInfo}>
                          <Text style={[styles.postUserName, { color: COLORS.text }]}>
                            {post.userName}
                          </Text>
                          <View style={[styles.postCategoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
                            <Text style={[styles.postCategoryText, { color: COLORS.accent }]}>
                              {post.category}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={[styles.postTitle, { color: COLORS.text }]} numberOfLines={2}>
                        {post.title}
                      </Text>
                      <Text style={[styles.postContent, { color: COLORS.textSecondary }]} numberOfLines={2}>
                        {post.content}
                      </Text>
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
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد نتائج</Text>
                  <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                    جرب البحث بكلمات مختلفة
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Users Results */}
          {selectedTab === 'users' && (
            <>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <Animated.View
                    key={user.id}
                    entering={FadeInDown.delay(100 + index * 50).springify()}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.userCard, { backgroundColor: COLORS.cardBg }]}
                    >
                      <View style={styles.userInfo}>
                        {user.avatar ? (
                          <ExpoImage
                            source={{ uri: user.avatar }}
                            style={styles.userAvatar}
                            contentFit="cover"
                          />
                        ) : (
                          <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.userAvatar}>
                            <Ionicons name="person" size={28} color="#FFF" />
                          </LinearGradient>
                        )}
                        <View style={styles.userDetails}>
                          <Text style={[styles.userName, { color: COLORS.text }]}>{user.name}</Text>
                          <Text style={[styles.userUsername, { color: COLORS.textSecondary }]}>
                            {user.username}
                          </Text>
                          <Text style={[styles.userBio, { color: COLORS.textSecondary }]} numberOfLines={1}>
                            {user.bio}
                          </Text>
                          <View style={styles.userStats}>
                            <Ionicons name="people" size={14} color={COLORS.textSecondary} />
                            <Text style={[styles.userStatsText, { color: COLORS.textSecondary }]}>
                              {user.followers} متابع
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[styles.followButton, { backgroundColor: COLORS.accent }]}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      >
                        <Text style={styles.followButtonText}>متابعة</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد نتائج</Text>
                  <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                    جرب البحث بكلمات مختلفة
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Boxes Results */}
          {selectedTab === 'boxes' && (
            <>
              {filteredBoxes.length > 0 ? (
                filteredBoxes.map((box, index) => (
                  <Animated.View
                    key={box.id}
                    entering={FadeInDown.delay(100 + index * 50).springify()}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.boxCard, { backgroundColor: COLORS.cardBg }]}
                    >
                      <ExpoImage
                        source={{ uri: box.image }}
                        style={styles.boxImage}
                        contentFit="cover"
                      />
                      <View style={styles.boxContent}>
                        <View style={styles.boxHeader}>
                          <Ionicons name={box.icon as any} size={24} color={COLORS.accent} />
                          <View style={[styles.boxCategoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
                            <Text style={[styles.boxCategoryText, { color: COLORS.accent }]}>
                              {box.category}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.boxTitle, { color: COLORS.text }]} numberOfLines={2}>
                          {box.title}
                        </Text>
                        <Text style={[styles.boxDescription, { color: COLORS.textSecondary }]} numberOfLines={2}>
                          {box.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="cube-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={[styles.emptyText, { color: COLORS.text }]}>لا توجد نتائج</Text>
                  <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                    جرب البحث بكلمات مختلفة
                  </Text>
                </View>
              )}
            </>
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  tab: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
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
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: 'Cairo_700Bold',
  },
  resultsContainer: {
    paddingHorizontal: 24,
    gap: 12,
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
  postHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postCategoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  postCategoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
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
  userCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
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
  userInfo: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  userUsername: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  userBio: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  userStats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  userStatsText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  boxCard: {
    borderRadius: 16,
    overflow: 'hidden',
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
  boxImage: {
    width: '100%',
    height: 150,
  },
  boxContent: {
    padding: 16,
    gap: 8,
  },
  boxHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxCategoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  boxCategoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  boxDescription: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 22,
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
  },
});