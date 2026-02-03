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
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth(); // We can also use useAuth to get initial user, but better fetch fresh
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setName(response.data.name || '');
        setBio(response.data.bio || '');
        setProfileImage(response.data.profile_image || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('خطأ', 'فشل تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('تنبيه', 'نحتاج صلاحية الوصول للصور لتغيير صورتك الشخصية');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('خطأ', 'فشل اختيار الصورة');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال الاسم');
      return;
    }

    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);

      if (newImageUri) {
        // Append image as file
        const filename = newImageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore: FormData expects Blob/File on web, but works with object in RN
        formData.append('profile_image', {
          uri: newImageUri,
          name: filename,
          type: type,
        });
      }

      const response = await api.updateProfile(formData);

      if (response.success) {
        // Update global auth context so image changes everywhere immediately
        updateUser(response.data);

        Alert.alert('نجح', 'تم حفظ التغييرات بنجاح!', [
          { text: 'حسناً', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('خطأ', response.message || 'فشل تحديث الملف الشخصي');
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const displayImageUri = newImageUri || api.getFileUrl(profileImage);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
            disabled={saving}
          >
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>تعديل الملف الشخصي</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Image Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.imageSection}>
          <View style={styles.avatarContainer}>
            {displayImageUri ? (
              <Image source={{ uri: displayImageUri }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={['#E8B86D', '#D4A574', '#C9956A']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person" size={56} color="#FFF" />
              </LinearGradient>
            )}
            <TouchableOpacity
              onPress={handlePickImage}
              style={[styles.cameraButton, { backgroundColor: COLORS.accent }]}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.imageHint, { color: COLORS.textSecondary }]}>
            اضغط لتغيير الصورة الشخصية
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
          {/* Name Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الاسم <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={[styles.input, { color: COLORS.text }]}
                placeholder="أدخل اسمك"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                textAlign="right"
                editable={!saving}
              />
            </View>
          </View>

          {/* Bio Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              نبذة عنك
            </Text>
            <View style={[styles.bioContainer, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} style={styles.bioIcon} />
              <TextInput
                style={[styles.bioInput, { color: COLORS.text }]}
                placeholder="اكتب نبذة مختصرة عنك..."
                placeholderTextColor={COLORS.textSecondary}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlign="right"
                textAlignVertical="top"
                editable={!saving}
              />
            </View>
            <Text style={[styles.charCount, { color: COLORS.textSecondary }]}>
              {bio.length} / 150 حرف
            </Text>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: COLORS.accent + '15', borderColor: COLORS.accent + '30' }]}>
            <Ionicons name="bulb" size={20} color={COLORS.accent} />
            <Text style={[styles.infoText, { color: COLORS.text }]}>
              سيظهر اسمك ونبذتك في ملفك الشخصي وعلى منشوراتك
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            style={styles.saveButton}
            disabled={saving}
          >
            <LinearGradient
              colors={saving ? ['#ccc', '#bbb'] : ['#E8B86D', '#D4A574']}
              style={styles.saveGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                  <Text style={styles.saveText}>حفظ التغييرات</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={[styles.cancelButton, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}
            disabled={saving}
          >
            <Text style={[styles.cancelText, { color: COLORS.textSecondary }]}>إلغاء</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  imageSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageHint: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  bioContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  bioIcon: {
    marginTop: 2,
  },
  bioInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    minHeight: 100,
  },
  charCount: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  infoCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 22,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  saveText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    color: '#FFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
  },
});