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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import seedData from '../constants/seed-data.json';

export default function CreateImagePostScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [selectedBox, setSelectedBox] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const boxes = seedData.cards;
  const categories = ['تقنية', 'فن', 'أدب', 'رياضة', 'سفر', 'أعمال'];

  const handlePickImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('اختيار صورة', 'سيتم إضافة وظيفة اختيار الصورة قريباً');
  };

  const handleSubmit = () => {
    if (!selectedBox || !selectedCategory || !title || !description) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('نجح', 'تم إنشاء المنشور بنجاح!', [
      { text: 'حسناً', onPress: () => navigation.goBack() }
    ]);
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
              colors={['#E94B3C', '#D43F30']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="image" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>منشور بصورة</Text>
          </View>
        </View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.form}>
          {/* Image Picker */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الصورة <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={handlePickImage}
              style={[
                styles.imagePicker,
                { 
                  backgroundColor: COLORS.cardBg,
                  borderColor: COLORS.border,
                }
              ]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={48} color={COLORS.textSecondary} />
                  <Text style={[styles.imagePickerText, { color: COLORS.textSecondary }]}>
                    اضغط لاختيار صورة
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Box Selection */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              الصندوق <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
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
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: selectedBox === box.id ? COLORS.accent : COLORS.cardBg,
                      borderColor: COLORS.border,
                    }
                  ]}
                >
                  <Ionicons 
                    name={box.icon as any} 
                    size={18} 
                    color={selectedBox === box.id ? '#FFF' : COLORS.text} 
                  />
                  <Text 
                    style={[
                      styles.optionText,
                      { color: selectedBox === box.id ? '#FFF' : COLORS.text }
                    ]}
                  >
                    {box.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Category Selection */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              التصنيف <Text style={{ color: '#E94B3C' }}>*</Text>
            </Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={[
                    styles.categoryChip,
                    { 
                      backgroundColor: selectedCategory === category ? COLORS.accent : COLORS.cardBg,
                      borderColor: COLORS.border,
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      { color: selectedCategory === category ? '#FFF' : COLORS.text }
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
              placeholder="اكتب عنواناً للصورة"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
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
              placeholder="أضف وصفاً للصورة..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlign="right"
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            style={styles.submitButton}
          >
            <LinearGradient
              colors={['#E8B86D', '#D4A574']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.submitText}>نشر المنشور</Text>
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
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  imagePicker: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  imagePickerText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
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
