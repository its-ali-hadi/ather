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

export default function MyCommentsScreen() {
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
        border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
    };

    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is guest when screen loads
        if (isGuest) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
                'تسجيل الدخول مطلوب',
                'يجب عليك تسجيل الدخول لعرض التعليقات',
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
            fetchMyComments();
        }
    }, [isGuest]);

    const fetchMyComments = async () => {
        try {
            setLoading(true);
            const response = await api.getMyComments();
            if (response.success) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        Alert.alert(
            'حذف التعليق',
            'هل أنت متأكد من رغبتك في حذف هذا التعليق؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
                    style: 'destructive',
                    onPress: async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        try {
                            // Optimistic update
                            const previousComments = [...comments];
                            setComments(current => current.filter(c => c.id !== commentId));

                            await api.deleteComment(commentId);
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                            Alert.alert('خطأ', 'فشل حذف التعليق');
                            fetchMyComments(); // Refresh on error
                        }
                    }
                }
            ]
        );
    };

    const renderCommentCard = (comment: any, index: number) => {
        return (
            <Animated.View
                key={comment.id}
                entering={FadeInDown.delay(100 + index * 50).springify()}
                style={styles.commentCard}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Navigate to post detail
                        // @ts-ignore
                        navigation.navigate('PostDetail', { postId: comment.post_id.toString() });
                    }}
                    style={[styles.commentCardInner, { backgroundColor: COLORS.cardBg }]}
                >
                    {/* PostContext */}
                    <View style={[styles.postContext, { borderBottomColor: COLORS.border }]}>
                        <Ionicons name="document-text" size={16} color={COLORS.textSecondary} />
                        <Text style={[styles.postTitle, { color: COLORS.textSecondary }]} numberOfLines={1}>
                            {comment.post_title || 'منشور محذوف'}
                        </Text>
                    </View>

                    {/* Comment Content */}
                    <View style={styles.commentContent}>
                        <Text style={[styles.commentText, { color: COLORS.text }]}>
                            {comment.content}
                        </Text>
                        <View style={styles.commentMeta}>
                            <Text style={[styles.commentTime, { color: COLORS.textSecondary }]}>
                                {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={[styles.actions, { borderTopColor: COLORS.border }]}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteComment(comment.id)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#E94B3C" />
                            <Text style={[styles.actionText, { color: '#E94B3C' }]}>حذف</Text>
                        </TouchableOpacity>
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
                        colors={['#1ABC9C', '#16A085']}
                        style={styles.headerIcon}
                    >
                        <Ionicons name="chatbubble" size={28} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.headerTitle, { color: COLORS.text }]}>التعليقات</Text>
                </View>
            </View>

            {/* Comments List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
            >
                <View style={styles.commentsContainer}>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => renderCommentCard(comment, index))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubble-outline" size={64} color={COLORS.textSecondary} />
                            <Text style={[styles.emptyText, { color: COLORS.text }]}>
                                لا توجد تعليقات بعد
                            </Text>
                            <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                                تعليقاتك على المنشورات ستظهر هنا
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
    commentsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    commentCard: {
        marginBottom: 16,
    },
    commentCardInner: {
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
    postContext: {
        padding: 12,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    postTitle: {
        fontSize: 13,
        fontFamily: 'Tajawal_500Medium',
        flex: 1,
        textAlign: 'right',
    },
    commentContent: {
        padding: 16,
        gap: 8,
    },
    commentText: {
        fontSize: 16,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
        lineHeight: 24,
    },
    commentMeta: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
    commentTime: {
        fontSize: 12,
        fontFamily: 'Tajawal_400Regular',
    },
    actions: {
        flexDirection: 'row-reverse',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    actionButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        padding: 4,
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'Tajawal_500Medium',
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
