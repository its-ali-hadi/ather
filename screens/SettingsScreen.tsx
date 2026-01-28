import { Ionicons } from '@expo/vector-icons';
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  
  // Settings states
  const [postsNotifications, setPostsNotifications] = useState(true);
  const [interactionsNotifications, setInteractionsNotifications] = useState(true);
  const [profileNotifications, setProfileNotifications] = useState(false);
  const [generalNotifications, setGeneralNotifications] = useState(true);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const settingsSections = [
    {
      id: '1',
      title: 'المحتوى',
      items: [
        {
          id: '1-1',
          title: 'المنشورات',
          description: 'إدارة منشوراتك المحفوظة والمنشورة',
          icon: 'document-text',
          color: '#4A90E2',
          action: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('المنشورات', 'سيتم إضافة هذه الميزة قريباً');
          },
        },
        {
          id: '1-2',
          title: 'التفاعلات',
          description: 'عرض وإدارة تفاعلاتك مع المنشورات',
          icon: 'heart',
          color: '#E94B3C',
          action: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('التفاعلات', 'سيتم إضافة هذه الميزة قريباً');
          },
        },
        {
          id: '1-3',
          title: 'المفضلات',
          description: 'المنشورات والمحتوى المحفوظ',
          icon: 'bookmark',
          color: '#F39C12',
          action: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('المفضلات', 'سيتم إضافة هذه الميزة قريباً');
          },
        },
      ],
    },
    {
      id: '2',
      title: 'الحساب',
      items: [
        {
          id: '2-1',
          title: 'الملف الشخصي',
          description: 'تعديل معلومات ملفك الشخصي',
          icon: 'person',
          color: '#9B59B6',
          action: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('الملف الشخصي', 'سيتم إضافة هذه الميزة قريباً');
          },
        },
        {
          id: '2-2',
          title: 'المحظورين',
          description: 'إدارة قائمة المستخدمين المحظورين',
          icon: 'ban',
          color: '#E74C3C',
          action: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('المحظورين', 'سيتم إضافة هذه الميزة قريباً');
          },
        },
      ],
    },
    {
      id: '3',
      title: 'الإشعارات',
      items: [
        {
          id: '3-1',
          title: 'إشعارات المنشورات',
          description: 'تلقي إشعارات عند نشر محتوى جديد',
          icon: 'notifications',
          color: '#3498DB',
          hasSwitch: true,
          value: postsNotifications,
          onToggle: (value: boolean) => {
            setPostsNotifications(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: '3-2',
          title: 'إشعارات التفاعلات',
          description: 'تلقي إشعارات عند التفاعل مع منشوراتك',
          icon: 'chatbubbles',
          color: '#1ABC9C',
          hasSwitch: true,
          value: interactionsNotifications,
          onToggle: (value: boolean) => {
            setInteractionsNotifications(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: '3-3',
          title: 'إشعارات الملف الشخصي',
          description: 'تلقي إشعارات عند متابعة حسابك',
          icon: 'person-add',
          color: '#9B59B6',
          hasSwitch: true,
          value: profileNotifications,
          onToggle: (value: boolean) => {
            setProfileNotifications(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: '3-4',
          title: 'الإشعارات العامة',
          description: 'تلقي إشعارات عامة من المنصة',
          icon: 'megaphone',
          color: '#E67E22',
          hasSwitch: true,
          value: generalNotifications,
          onToggle: (value: boolean) => {
            setGeneralNotifications(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ],
    },
  ];

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            Alert.alert('تم الحذف', 'تم حذف حسابك بنجاح');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
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
              colors={['#50C878', '#45B369']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="settings" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>الإعدادات</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Animated.View 
            key={section.id}
            entering={FadeInDown.delay(100 + sectionIndex * 100).springify()}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              {section.title}
            </Text>
            
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={item.hasSwitch ? 1 : 0.8}
                  onPress={item.hasSwitch ? undefined : item.action}
                  style={[
                    styles.settingItem,
                    { backgroundColor: COLORS.cardBg },
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                >
                  <View style={styles.settingContent}>
                    <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={[styles.settingTitle, { color: COLORS.text }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.settingDescription, { color: COLORS.textSecondary }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  
                  {item.hasSwitch ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: COLORS.border, true: COLORS.accent }}
                      thumbColor={item.value ? '#FFF' : '#f4f3f4'}
                      ios_backgroundColor={COLORS.border}
                    />
                  ) : (
                    <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Delete Account Button */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.deleteSection}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDeleteAccount}
            style={[styles.deleteButton, { backgroundColor: COLORS.cardBg }]}
          >
            <View style={styles.deleteContent}>
              <View style={[styles.deleteIcon, { backgroundColor: '#E74C3C20' }]}>
                <Ionicons name="trash" size={24} color="#E74C3C" />
              </View>
              <View style={styles.deleteTextContainer}>
                <Text style={[styles.deleteTitle, { color: '#E74C3C' }]}>
                  حذف الحساب
                </Text>
                <Text style={[styles.deleteDescription, { color: COLORS.textSecondary }]}>
                  حذف حسابك وجميع بياناتك نهائياً
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  sectionItems: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 18,
  },
  deleteSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
    ...Platform.select({
      ios: {
        shadowColor: '#E74C3C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deleteContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  deleteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteTextContainer: {
    flex: 1,
    gap: 4,
  },
  deleteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  deleteDescription: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 18,
  },
});