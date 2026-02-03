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
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../utils/api';

export default function CreateVideoPostScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [boxes, setBoxes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loadingBoxes, setLoadingBoxes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

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
    fetchBoxes();
  }, []);

  useEffect(() => {
    if (selectedBox) {
      fetchCategories(selectedBox);
    } else {
      setCategories([]);
    }
  }, [selectedBox]);

  const fetchBoxes = async () => {
    try {
      const response = await api.getBoxes();
      if (response.success) {
        setBoxes(response.data);
      }
    } catch (error) {
      console.error('Error fetching boxes:', error);
      Alert.alert('خطأ', 'فشل تحميل الصناديق');
    } finally {
      setLoadingBoxes(false);
    }
  };

  const fetchCategories = async (boxId: number) => {
    setLoadingCategories(true);
    try {
      const response = await api.getCategories(boxId);
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handlePickVideo = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج صلاحية الوصول للفيديوهات');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 300, // 5 minutes
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('خطأ', 'فشل اختيار الفيديو');
    }
  };

  const handleSubmit = async () => {
    if (!selectedBox || !selectedCategory || !title || !description || !videoUri) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('type', 'video');
      formData.append('title', title);
      formData.append('content', description);
      formData.append('category', selectedCategory);
      formData.append('is_private', isPrivate ? 'true' : 'false');

      const filename = videoUri.split('/').pop() || 'video.mp4';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `video/${match[1]}` : 'video/mp4';

      // @ts-ignore
      formData.append('file', {
        uri: videoUri,
        name: filename,
        type: type,
      });

      const response = await api.createPost(formData);

      if (response.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('نجح', `تم نشر المنشور ${isPrivate ? 'الخاص' : 'العام'} بنجاح!`, [
          { text: 'حسناً', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('خطأ', response.message || 'فشل نشر المنشور');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء النشر');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={uploading}
          >
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={['#9B59B6', '#8E44AD']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="videocam" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>منشور بفيديو</Text>
          </View>
        </View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.form}>
          {/* Privacy Toggle */}
          <View style={[styles.privacyContainer, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}>
            <View style={styles.privacyContent}>
              <View style={styles.privacyInfo}>
                <Ionicons
                  name={isPrivate ? "lock-closed" : "globe-outline"}
                  size={24}
                  color={isPrivate ? '#E94B3C' : '#50C878'}
                />
                <View style={styles.privacyTextContainer}>
                  <Text style={[styles.privacyTitle, { color: COLORS.text }]}>
                    {isPrivate ? 'منشور خاص' : 'منشور عام'}
                  </Text>
                  <Text style={[styles.privacyDescription, { color: COLORS.textSecondary }]}>
                    {isPrivate
                      ? 'سيظهر فقط في قسم المنشورات الخاصة'
                      : 'سيظهر للجميع في الصفحة الرئيسية'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={(value) => {
                  setIsPrivate(value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                trackColor={{ false: '#50C878', true: '#E94B3C' }}
                thumbColor="#FFF"
                disabled={uploading}
              />
            </View>
          </View>

          {/* Video Picker */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الفيديو <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={handlePickVideo}
              disabled={uploading}
              style={[
                styles.videoPicker,
                {
                  backgroundColor: COLORS.cardBg,
                  borderColor: COLORS.border,
                }
              ]}
            >
              <Ionicons
                name={videoUri ? "checkmark-circle" : "play-circle-outline"}
                size={64}
                color={videoUri ? '#4CAF50' : COLORS.textSecondary}
              />
              <Text style={[styles.videoPickerText, { color: COLORS.textSecondary }]}>
                {videoUri ? 'تم اختيار الفيديو ✓' : 'اضغط لاختيار فيديو'}
              </Text>
              <Text style={[styles.videoPickerHint, { color: COLORS.textSecondary }]}>
                الحد الأقصى: 5 دقائق
              </Text>
            </TouchableOpacity>
          </View>

          {/* Box Selection */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الصندوق <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            {loadingBoxes ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsScrollContent}
              >
                {boxes.map((box) => (
                  <TouchableOpacity
                    key={box.id}
                    onPress={() => {
                      setSelectedBox(box.id);
                      setSelectedCategory('');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={uploading}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor: selectedBox === box.id ? COLORS.accent : COLORS.cardBg,
                        borderColor: COLORS.border,
                      }
                    ]}
                  >
                    <Ionicons
                      name={box.icon || 'cube'}
                      size={18}
                      color={selectedBox === box.id ? '#FFF' : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: selectedBox === box.id ? '#FFF' : COLORS.text }
                      ]}
                    >
                      {box.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Category Selection */}
          {selectedBox && (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                التصنيف <Text style={{ color: '#E94B3C' }}>*</Text>
              </Text>
              {loadingCategories ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <View style={styles.categoriesGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        setSelectedCategory(cat.name);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      disabled={uploading}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: selectedCategory === cat.name ? COLORS.accent : COLORS.cardBg,
                          borderColor: COLORS.border,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: selectedCategory === cat.name ? '#FFF' : COLORS.text }
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {categories.length === 0 && (
                    <Text style={{ color: COLORS.textSecondary, fontFamily: 'Tajawal_400Regular' }}>
                      لا توجد تصنيفات في هذا الصندوق
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Title Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              العنوان <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: COLORS.cardBg,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                }
              ]}
              placeholder="اكتب عنواناً للفيديو"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
              editable={!uploading}
            />
          </View>

          {/* Description Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الوصف <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: COLORS.cardBg,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                }
              ]}
              placeholder="أضف وصفاً للفيديو..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlign="right"
              textAlignVertical="top"
              editable={!uploading}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={uploading}
            style={styles.submitButton}
          >
            <LinearGradient
              colors={uploading ? ['#999', '#777'] : ['#E8B86D', '#D4A574']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {uploading ? (
                <>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.submitText}>جاري النشر...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                  <Text style={styles.submitText}>نشر المنشور</Text>
                </>
              )}
            </LinearGradient>
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
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  privacyContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  privacyContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
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
  videoPicker: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  videoPickerText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  videoPickerHint: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
  },
  optionsScrollContent: {
    paddingRight: 4,
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  categoriesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    minHeight: 150,
  },
  submitButton: {
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
  submitGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    color: '#FFF',
  },
});
