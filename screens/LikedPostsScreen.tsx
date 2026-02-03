import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function LikedPostsScreen() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const { isGuest, logout } = useAuth();

    const COLORS = {
        primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
        accent: '#E8B86D',
        background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
        cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
        textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    };

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is guest when screen loads
        if (isGuest) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
                'تسجيل الدخول مطلوب',
                'يجب عليك تسجيل الدخول لعرض الإعجابات',
                [
                    {
                        text: 'إلغاء',
                        style: 'cancel',
                        onPress: () => navigation.goBack(),
                    },
                    {
                        text: 'تسجيل الدخول',
                        onPress: async () => {
                            await logout();
                        },
                    },
                ]
            );
        } else {
            fetchLikedPosts();
        }
    }, [isGuest]);

    const fetchLikedPosts = async () => {
        try {
            setLoading(true);
            const response = await api.getLikedPosts();
            if (response.success) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlike = async (postId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Optimistic update
        const previousPosts = [...posts];
        setPosts(current => current.filter(p => p.id !== postId));

        try {
            await api.toggleLike(postId);
        } catch (error) {
            console.error('Error unliking post:', error);
            // Revert if error
            setPosts(previousPosts);
            Alert.alert('خطأ', 'فشل إلغاء الإعجاب');
        }
    };

    const renderPostCard = (post: any, index: number) => {
        return (
            <Animated.View
                key={post.id}
                entering={FadeInDown.delay(100 + index * 50).springify()}
                style={styles.postCard}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Navigate to post detail
                        // @ts-ignore
                        navigation.navigate('PostDetail', { postId: post.id.toString() });
                    }}
                    style={[styles.postCardInner, { backgroundColor: COLORS.cardBg }]}
                >
                    {/* Post Header */}
                    <View style={styles.postHeader}>
                        <View style={styles.userInfo}>
                            {post.user_image ? (
                                <ExpoImage
                                    source={{ uri: api.getFileUrl(post.user_image) }}
                                    style={styles.userAvatar}
                                    contentFit="cover"
                                />
                            ) : (
                                <LinearGradient
                                    colors={['#E8B86D', '#D4A574']}
                                    style={styles.userAvatar}
                                >
                                    <Ionicons name="person" size={20} color="#FFF" />
                                </LinearGradient>
                            )}
                            <View style={styles.userDetails}>
                                <Text style={[styles.userName, { color: COLORS.text }]}>
                                    {post.user_name}
                                </Text>
                                <Text style={[styles.postTime, { color: COLORS.textSecondary }]}>
                                    {new Date(post.created_at).toLocaleDateString('ar-SA')}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleUnlike(post.id)}
                            style={styles.favoriteButton}
                        >
                            <Ionicons name="heart" size={24} color="#E94B3C" />
                        </TouchableOpacity>
                    </View>

                    {/* Post Content */}
                    <View style={styles.postContent}>
                        <Text style={[styles.postTitle, { color: COLORS.text }]}>
                            {post.title}
                        </Text>
                        <Text
                            style={[styles.postDescription, { color: COLORS.textSecondary }]}
                            numberOfLines={2}
                        >
                            {post.content}
                        </Text>
                    </View>

                    {/* Post Image */}
                    {post.media_url && post.type === 'image' && (
                        <ExpoImage
                            source={{ uri: api.getFileUrl(post.media_url) }}
                            style={styles.postImage}
                            contentFit="cover"
                        />
                    )}

                    {/* Post Stats */}
                    <View style={styles.postStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="heart" size={16} color="#E94B3C" />
                            <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                                {post.likes_count}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="chatbubble" size={16} color={COLORS.textSecondary} />
                            <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                                {post.comments_count}
                            </Text>
                        </View>
                        <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
                            <Text style={[styles.categoryText, { color: COLORS.accent }]}>
                                {post.category}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <LinearGradient
                        colors={['#E94B3C', '#C0392B']}
                        style={styles.headerIcon}
                    >
                        <Ionicons name="heart" size={28} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.headerTitle, { color: COLORS.text }]}>الإعجابات</Text>
                </View>
            </View>

            {/* Posts List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
            >
                <View style={styles.postsContainer}>
                    {posts.length > 0 ? (
                        posts.map((post, index) => renderPostCard(post, index))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
                            <Text style={[styles.emptyText, { color: COLORS.text }]}>
                                لا توجد إعجابات بعد
                            </Text>
                            <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                                الإعجابات التي تقوم بها ستظهر هنا
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
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
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
    postsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    postCard: {
        marginBottom: 16,
    },
    postCardInner: {
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
    favoriteButton: {
        padding: 8,
    },
    postContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
        lineHeight: 28,
    },
    postDescription: {
        fontSize: 15,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
        lineHeight: 24,
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    postStats: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontFamily: 'Tajawal_500Medium',
    },
    categoryBadge: {
        marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
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
