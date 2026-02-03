import { Ionicons } from '@expo/vector-icons';
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
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import api from '../utils/api';

export default function SupportScreen() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const COLORS = {
        primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
        accent: '#E8B86D',
        background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
        cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
        textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
        inputBg: colorScheme === 'dark' ? 'rgba(42, 36, 32, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
    };

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert('تنبيه', 'يرجى ملء جميع الحقول');
            return;
        }

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const response = await api.createContactMessage({
                subject: subject.trim(),
                message: message.trim(),
            });

            if (response.success) {
                Alert.alert(
                    'تم الإرسال',
                    'تم استلام رسالتك بنجاح وسنرد عليك قريباً',
                    [{ text: 'حسناً', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('خطأ', 'فشل إرسال الرسالة، يرجى المحاولة لاحقاً');
            }
        } catch (error) {
            console.error('Error sending support message:', error);
            Alert.alert('خطأ', 'حدث خطأ غير متوقع');
        } finally {
            setLoading(false);
        }
    };

    const handleContactPress = (type: 'phone' | 'email', value: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === 'phone') {
            Linking.openURL(`tel:${value}`);
        } else {
            Linking.openURL(`mailto:${value}`);
        }
    };

    const contactInfo = [
        {
            id: 'phone1',
            type: 'phone',
            icon: 'call',
            title: 'رقم الهاتف 1',
            value: '+964 770 123 4567',
        },
        {
            id: 'phone2',
            type: 'phone',
            icon: 'call',
            title: 'رقم الهاتف 2',
            value: '+964 750 123 4567',
        },
        {
            id: 'email',
            type: 'email',
            icon: 'mail',
            title: 'البريد الإلكتروني',
            value: 'support@ather.app',
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <LinearGradient colors={['#E8B86D', '#C4A57B']} style={styles.headerIcon}>
                        <Ionicons name="headset" size={28} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.headerTitle, { color: COLORS.text }]}>الدعم والمساعدة</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
            >
                {/* Contact Form */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={[styles.formContainer, { backgroundColor: COLORS.cardBg }]}
                >
                    <Text style={[styles.sectionTitle, { color: COLORS.text }]}>أرسل لنا رسالة</Text>
                    <Text style={[styles.sectionSubtitle, { color: COLORS.textSecondary }]}>
                        نحن هنا لمساعدتك في أي وقت
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: COLORS.text }]}>عنوان الرسالة</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: COLORS.inputBg, color: COLORS.text, borderColor: COLORS.border }]}
                            placeholder="مثال: مشكلة في تسجيل الدخول"
                            placeholderTextColor={COLORS.textSecondary}
                            value={subject}
                            onChangeText={setSubject}
                            textAlign="right"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: COLORS.text }]}>تفاصيل الرسالة</Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                                { backgroundColor: COLORS.inputBg, color: COLORS.text, borderColor: COLORS.border },
                            ]}
                            placeholder="اشرح مشكلتك بالتفصيل..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            textAlign="right"
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={loading}
                        style={styles.sendButton}
                    >
                        <LinearGradient
                            colors={['#E8B86D', '#C4A57B']}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.sendButtonText}>إرسال</Text>
                                    <Ionicons name="send" size={20} color="#FFF" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Contact Info Cards */}
                <View style={styles.contactsContainer}>
                    <Text style={[styles.contactsTitle, { color: COLORS.text }]}>طرق التواصل المباشر</Text>

                    {contactInfo.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(200 + index * 100).springify()}
                        >
                            <TouchableOpacity
                                style={[styles.contactCard, { backgroundColor: COLORS.cardBg }]}
                                onPress={() => handleContactPress(item.type as any, item.value)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.contactIconContainer}>
                                    <LinearGradient
                                        colors={['rgba(232, 184, 109, 0.2)', 'rgba(196, 165, 123, 0.2)']}
                                        style={styles.contactIconBg}
                                    >
                                        <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                                    </LinearGradient>
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactTitle, { color: COLORS.textSecondary }]}>{item.title}</Text>
                                    <Text style={[styles.contactValue, { color: COLORS.text }]}>{item.value}</Text>
                                </View>
                                <Ionicons name={item.type === 'phone' ? 'call-outline' : 'mail-outline'} size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
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
    formContainer: {
        margin: 24,
        padding: 24,
        borderRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
        gap: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        fontSize: 15,
        fontFamily: 'Tajawal_400Regular',
    },
    textArea: {
        height: 120,
        paddingTop: 12,
    },
    sendButton: {
        marginTop: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    sendButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    contactsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    contactsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
        textAlign: 'right',
        marginTop: 8,
        marginBottom: 8,
    },
    contactCard: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 16,
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
    contactIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    contactIconBg: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        gap: 4,
    },
    contactTitle: {
        fontSize: 13,
        fontFamily: 'Tajawal_400Regular',
        textAlign: 'right',
    },
    contactValue: {
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Tajawal_700Bold',
        textAlign: 'right',
        direction: 'ltr',
    },
});
