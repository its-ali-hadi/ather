import { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../utils/api';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'UsersList'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UsersListScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<NavigationProp>();
    const colorScheme = useColorScheme();
    const { type, userId } = route.params || {};
    const { isGuest, user: currentUser } = useAuth();

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const title = type === 'followers' ? 'المتابعون' : 'المتابَعون';

    const COLORS = {
        primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
        background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
        cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
        textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
        border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (pageNum = 1) => {
        try {
            if (pageNum === 1) setLoading(true);

            let response;
            if (type === 'followers') {
                response = await api.getFollowers(userId, pageNum);
            } else {
                response = await api.getFollowing(userId, pageNum);
            }

            if (response.success) {
                if (pageNum === 1) {
                    setUsers(response.data);
                } else {
                    setUsers(prev => [...prev, ...response.data]);
                }

                setHasMore(response.pagination.hasMore);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers(1);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchUsers(page + 1);
        }
    };

    const handleUserPress = (selectedUserId: string) => {
        navigation.navigate('UserProfile', { userId: selectedUserId });
    };

    const handleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
        if (isGuest) {
            Alert.alert('تنبيه', 'يجب عليك تسجيل الدخول للمتابعة');
            return;
        }

        if (currentUser?.id === parseInt(targetUserId)) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            if (isCurrentlyFollowing) {
                await api.unfollowUser(targetUserId);
            } else {
                await api.followUser(targetUserId);
            }

            setUsers(prev => prev.map(u =>
                u.id.toString() === targetUserId.toString()
                    ? { ...u, is_following: !isCurrentlyFollowing }
                    : u
            ));
        } catch (error) {
            console.error('Follow error:', error);
            Alert.alert('خطأ', 'فشل تنفيذ الطلب');
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.userCard, { backgroundColor: COLORS.cardBg }]}
            onPress={() => handleUserPress(item.id)}
            activeOpacity={0.7}
        >
            {item.profile_image ? (
                <ExpoImage source={{ uri: item.profile_image }} style={styles.avatar} contentFit="cover" />
            ) : (
                <LinearGradient colors={['#E8B86D', '#D4A574']} style={styles.avatar}>
                    <Ionicons name="person" size={24} color="#FFF" />
                </LinearGradient>
            )}

            <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: COLORS.text }]}>{item.name}</Text>
                    {item.is_verified && (
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                    )}
                </View>
                {item.bio && (
                    <Text style={[styles.bio, { color: COLORS.textSecondary }]} numberOfLines={1}>
                        {item.bio}
                    </Text>
                )}
            </View>

            {currentUser?.id !== item.id && (
                <TouchableOpacity
                    style={[
                        styles.followButton,
                        { backgroundColor: item.is_following ? 'transparent' : COLORS.primary, borderColor: COLORS.primary, borderWidth: 1 }
                    ]}
                    onPress={() => handleFollow(item.id.toString(), !!item.is_following)}
                >
                    <Text style={[styles.followButtonText, { color: item.is_following ? COLORS.primary : '#FFF' }]}>
                        {item.is_following ? 'يتابع' : 'متابعة'}
                    </Text>
                </TouchableOpacity>
            )}

            <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: COLORS.text }]}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading && page === 1 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={COLORS.textSecondary} />
                            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                                لا يوجد مستخدمين
                            </Text>
                        </View>
                    }
                />
            )}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    listContainer: {
        padding: 16,
    },
    userCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    nameRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
    },
    bio: {
        fontSize: 14,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
        marginTop: 2,
    },
    followButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 8,
    },
    followButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Tajawal_500Medium',
    },
});
