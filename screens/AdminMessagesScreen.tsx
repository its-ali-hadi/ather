import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    RefreshControl,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../utils/api';

interface Message {
    id: number;
    subject: string;
    message: string;
    user_name: string;
    user_email: string;
    created_at: string;
    status: 'pending' | 'read' | 'replied' | 'closed';
}

export default function AdminMessagesScreen() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const COLORS = {
        primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
        background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
        cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
        textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
        border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
        pending: '#FF9800',
        read: '#2196F3',
        replied: '#4CAF50',
        closed: '#9E9E9E',
    };

    useEffect(() => {
        loadMessages();
    }, [page]);

    const loadMessages = async () => {
        try {
            if (page === 1) setLoading(true);
            const response = await api.getContactMessages(page);
            if (response.success && response.data) {
                if (page === 1) {
                    setMessages(response.data);
                } else {
                    setMessages(prev => [...prev, ...response.data]);
                }
                setHasMore(response.data.length >= 20);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadMessages();
    };

    const getStatusColor = (status: string) => {
        return COLORS[status as keyof typeof COLORS] || COLORS.textSecondary;
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            pending: 'معلق',
            read: 'مقروء',
            replied: 'تم الرد',
            closed: 'مغلق',
        };
        return labels[status as keyof typeof labels] || status;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Less than 24 hours
        if (diff < 24 * 60 * 60 * 1000) {
            if (diff < 60 * 1000) {
                const minutes = Math.floor(diff / (60 * 1000));
                return `منذ ${minutes} دقيقة`;
            }
            const hours = Math.floor(diff / (60 * 60 * 1000));
            return `منذ ${hours} ساعة`;
        }

        return date.toLocaleDateString('ar-EG');
    };

    const renderItem = ({ item, index }: { item: Message; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={[styles.messageCard, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusLabel(item.status)}
                    </Text>
                </View>
                <Text style={[styles.date, { color: COLORS.textSecondary }]}>
                    {formatDate(item.created_at)}
                </Text>
            </View>

            <Text style={[styles.subject, { color: COLORS.text }]}>{item.subject}</Text>

            <View style={styles.userInfo}>
                <Ionicons name="person-circle-outline" size={20} color={COLORS.textSecondary} />
                <Text style={[styles.userName, { color: COLORS.textSecondary }]}>
                    {item.user_name || 'زائر'}
                </Text>
            </View>

            <Text style={[styles.preview, { color: COLORS.textSecondary }]} numberOfLines={2}>
                {item.message}
            </Text>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.headerTitle, { color: COLORS.text }]}>الرسائل</Text>
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReached={() => hasMore && setPage(prev => prev + 1)}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbox-ellipses-outline" size={64} color={COLORS.textSecondary} />
                            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                                لا توجد رسائل حالياً
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    loading && page > 1 ? (
                        <View style={styles.loader}>
                            <ActivityIndicator color={COLORS.primary} />
                        </View>
                    ) : null
                }
            />
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
        paddingBottom: 16,
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    headerContent: {
        flex: 1,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    list: {
        padding: 24,
        gap: 16,
    },
    messageCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Cairo_600SemiBold',
    },
    date: {
        fontSize: 12,
        fontFamily: 'Tajawal_400Regular',
    },
    subject: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
    },
    userInfo: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        fontSize: 14,
        fontFamily: 'Tajawal_400Regular',
    },
    preview: {
        fontSize: 14,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
        lineHeight: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Tajawal_500Medium',
    },
    loader: {
        padding: 16,
        alignItems: 'center',
    },
});
