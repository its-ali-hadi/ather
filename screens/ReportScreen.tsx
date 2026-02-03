import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import api from '../utils/api';

const REPORT_REASONS = [
    'محتوى غير لائق',
    'سب أو شتم',
    'محتوى إباحي',
    'تحرش أو مضايقة',
    'نشر معلومات خاصة',
    'انتحال شخصية',
    'سبام أو رسائل مزعجة',
    'أخرى',
];

export default function ReportScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const colorScheme = useColorScheme();

    // @ts-ignore
    const { type, id, title } = route.params;

    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const COLORS = {
        primary: '#B8956A',
        background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
        card: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
        textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
        border: colorScheme === 'dark' ? '#3A322C' : '#E5E7EB',
    };

    const handleSubmit = async () => {
        if (!selectedReason) {
            Alert.alert('تنبيه', 'يرجى اختيار سبب الإبلاغ');
            return;
        }

        try {
            setLoading(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const response = await api.createReport({
                type,
                target_id: id,
                reason: selectedReason,
                description,
            });

            if (response.success) {
                Alert.alert(
                    'تم الإرسال',
                    'شكراً لك، لقد تم إرسال إبلاغك بنجاح وسيتم مراجعته من قبل فريق الإدارة في أقرب وقت ممكن.',
                    [{ text: 'حسنًا', onPress: () => navigation.goBack() }]
                );
            }
        } catch (error: any) {
            Alert.alert('خطأ', error.message || 'فشل إرسال الإبلاغ');
        } finally {
            setLoading(false);
        }
    };

    const getTypeText = () => {
        switch (type) {
            case 'post': return 'منشور';
            case 'user': return 'حساب';
            case 'comment': return 'تعليق';
            default: return 'عنصر';
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
            <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-forward" size={28} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: COLORS.text }]}>إبلاغ عن {getTypeText()}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: COLORS.card }]}>
                    <Text style={[styles.infoTitle, { color: COLORS.text }]}>
                        أنت تبلغ عن {getTypeText()}:
                    </Text>
                    <Text style={[styles.infoName, { color: COLORS.primary }]} numberOfLines={2}>
                        {title || `معرف ال${getTypeText()} #${id}`}
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: COLORS.text }]}>لماذا تبلغ عن هذا ال{getTypeText()}؟</Text>

                <View style={styles.reasonsContainer}>
                    {REPORT_REASONS.map((reason) => (
                        <TouchableOpacity
                            key={reason}
                            style={[
                                styles.reasonItem,
                                {
                                    backgroundColor: COLORS.card,
                                    borderColor: selectedReason === reason ? COLORS.primary : COLORS.border
                                }
                            ]}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setSelectedReason(reason);
                            }}
                        >
                            <Text style={[
                                styles.reasonText,
                                { color: selectedReason === reason ? COLORS.primary : COLORS.text }
                            ]}>
                                {reason}
                            </Text>
                            <Ionicons
                                name={selectedReason === reason ? "radio-button-on" : "radio-button-off"}
                                size={22}
                                color={selectedReason === reason ? COLORS.primary : COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: COLORS.text }]}>تفاصيل إضافية (اختياري)</Text>
                <TextInput
                    style={[styles.textInput, {
                        backgroundColor: COLORS.card,
                        color: COLORS.text,
                        borderColor: COLORS.border
                    }]}
                    placeholder="اشرح لنا المزيد عن المشكلة..."
                    placeholderTextColor={COLORS.textSecondary}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: COLORS.primary }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>إرسال الإبلاغ</Text>
                    )}
                </TouchableOpacity>

                <Text style={[styles.disclaimer, { color: COLORS.textSecondary }]}>
                    سيقوم فريق الإدارة بمراجعة هذا الإبلاغ واتخاذ الإجراء اللازم. الإبلاغات الكاذبة المتكررة قد تؤدي إلى تجميد حسابك.
                </Text>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    backButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(184, 149, 106, 0.2)',
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: 'Tajawal_500Medium',
        marginBottom: 4,
    },
    infoName: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Cairo_700Bold',
        marginBottom: 12,
        marginTop: 8,
    },
    reasonsContainer: {
        marginBottom: 20,
    },
    reasonItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
    },
    reasonText: {
        fontSize: 15,
        fontFamily: 'Tajawal_500Medium',
    },
    textInput: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        height: 120,
        marginBottom: 24,
        fontFamily: 'Tajawal_400Regular',
    },
    submitButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cairo_700Bold',
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Tajawal_400Regular',
        lineHeight: 18,
        paddingHorizontal: 10,
    },
});
