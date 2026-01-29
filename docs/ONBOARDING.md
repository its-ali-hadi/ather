# دليل الـ Onboarding في تطبيق أثر

## نظرة عامة

تم إضافة نظام Onboarding تفاعلي باستخدام مكتبة `react-native-copilot` لمساعدة المستخدمين الجدد على فهم كيفية استخدام التطبيق.

## المكتبات المستخدمة

- `react-native-copilot@3.3.3` - المكتبة الأساسية للـ Onboarding
- `react-native-svg@15.12.1` - للحصول على أنيميشن سلس
- `@react-native-async-storage/async-storage@2.2.0` - لحفظ حالة المستخدم

## خطوات الـ Onboarding

### الخطوة 1: زر الإشعارات
- **الموقع**: أعلى يسار الشاشة
- **الوصف**: "من هنا تقدر تشوف الإشعارات والتحديثات الجديدة"
- **الترتيب**: 1

### الخطوة 2: قسم "عن منصة أثر"
- **الموقع**: وسط الصفحة الرئيسية
- **الوصف**: "هنا تقدر تتعرف على منصة أثر وميزاتها المختلفة"
- **الترتيب**: 2

### الخطوة 3: زر "ابدأ رحلتك"
- **الموقع**: داخل قسم "عن منصة أثر"
- **الوصف**: "اضغط هنا لبدء رحلتك في منصة أثر وإنشاء حسابك"
- **الترتيب**: 3

### الخطوة 4: شريط التنقل
- **الموقع**: أسفل الشاشة
- **الوصف**: "هذا شريط التنقل الرئيسي. من هنا تقدر تتنقل بين الصفحات المختلفة: الرئيسية، استكشف، إنشاء، خاص، والملف الشخصي"
- **الترتيب**: 4

## كيفية عمل النظام

### 1. التشغيل التلقائي
- يتم تشغيل الـ Onboarding تلقائياً عند أول فتح للتطبيق
- يتم حفظ حالة المستخدم في AsyncStorage
- لن يظهر الـ Onboarding مرة أخرى بعد المشاهدة الأولى

### 2. التخصيص
- **Tooltip مخصص**: تم إنشاء مكون `CustomTooltip` بتصميم يتناسب مع هوية التطبيق
- **الألوان**: تتكيف مع الوضع الفاتح والداكن
- **الخطوط**: تستخدم خطوط Cairo و Tajawal العربية

### 3. التحكم
- **التالي**: الانتقال للخطوة التالية
- **السابق**: العودة للخطوة السابقة
- **تخطي**: إنهاء الـ Onboarding
- **إنهاء**: إنهاء الـ Onboarding في الخطوة الأخيرة

## الملفات المعدلة

### 1. `components/CustomTooltip.tsx`
مكون Tooltip مخصص يعرض:
- رقم الخطوة واسمها
- وصف الخطوة
- أزرار التنقل (السابق، التالي، تخطي)
- أيقونة مميزة

### 2. `App.tsx`
- إضافة `CopilotProvider` لتغليف التطبيق
- تكوين الإعدادات:
  - `overlay="svg"` - استخدام SVG للأنيميشن السلس
  - `backdropColor="rgba(0, 0, 0, 0.7)"` - لون الخلفية
  - `tooltipComponent={CustomTooltip}` - استخدام Tooltip المخصص
  - `verticalOffset={24}` - المسافة العمودية

### 3. `screens/HomeScreen.tsx`
- إضافة `CopilotStep` للعناصر المهمة
- استخدام `walkthroughable` HOC للمكونات
- التحقق من حالة المستخدم باستخدام AsyncStorage
- تشغيل الـ Onboarding تلقائياً للمستخدمين الجدد

## إعادة تشغيل الـ Onboarding

لإعادة تشغيل الـ Onboarding للاختبار:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// حذف حالة المستخدم
await AsyncStorage.removeItem('hasSeenTutorial');

// إعادة تحميل التطبيق
```

## التخصيص المستقبلي

### إضافة خطوات جديدة
```typescript
<CopilotStep
  text="وصف الخطوة الجديدة"
  order={5}
  name="stepName"
>
  <CopilotComponent>
    {/* المحتوى */}
  </CopilotComponent>
</CopilotStep>
```

### تعديل الألوان
عدّل ملف `components/CustomTooltip.tsx`:
```typescript
const COLORS = {
  primary: '#لونك_الأساسي',
  accent: '#لونك_المميز',
  // ...
};
```

### تعديل النصوص
عدّل خاصية `text` في كل `CopilotStep`:
```typescript
<CopilotStep
  text="النص الجديد"
  // ...
>
```

## الميزات

✅ تصميم عربي كامل (RTL)
✅ دعم الوضع الفاتح والداكن
✅ أنيميشن سلس باستخدام SVG
✅ Tooltip مخصص بتصميم احترافي
✅ حفظ حالة المستخدم
✅ تشغيل تلقائي للمستخدمين الجدد
✅ سهولة التخصيص والتوسع

## الدعم

للمزيد من المعلومات حول المكتبة:
- [React Native Copilot Documentation](https://github.com/mohebifar/react-native-copilot)
- [React Native SVG Documentation](https://github.com/software-mansion/react-native-svg)