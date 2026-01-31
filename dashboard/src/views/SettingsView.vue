<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">الإعدادات</h1>
      <p class="text-gray-600">إدارة إعدادات لوحة التحكم</p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Account Settings -->
      <div class="card">
        <h2 class="text-xl font-bold text-primary-900 mb-6">إعدادات الحساب</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input
              v-model="accountSettings.name"
              type="text"
              class="input-field"
              placeholder="اسم المدير"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="accountSettings.phone"
              type="tel"
              class="input-field"
              placeholder="07701234567"
              disabled
            />
            <p class="text-xs text-gray-500 mt-1">لا يمكن تغيير رقم الهاتف</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              v-model="accountSettings.email"
              type="email"
              class="input-field"
              placeholder="admin@example.com"
            />
          </div>
          <button class="btn-primary">
            حفظ التغييرات
          </button>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="card">
        <h2 class="text-xl font-bold text-primary-900 mb-6">الأمان</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الحالية</label>
            <input
              v-model="securitySettings.currentPassword"
              type="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
            <input
              v-model="securitySettings.newPassword"
              type="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
            <input
              v-model="securitySettings.confirmPassword"
              type="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>
          <button class="btn-primary">
            تغيير كلمة المرور
          </button>
        </div>
      </div>

      <!-- App Settings -->
      <div class="card">
        <h2 class="text-xl font-bold text-primary-900 mb-6">إعدادات التطبيق</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">السماح بالتسجيل</h3>
              <p class="text-sm text-gray-600">السماح للمستخدمين الجدد بإنشاء حسابات</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="appSettings.allowRegistration" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">مراجعة المنشورات</h3>
              <p class="text-sm text-gray-600">مراجعة المنشورات قبل نشرها</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="appSettings.moderatePosts" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">مراجعة التعليقات</h3>
              <p class="text-sm text-gray-600">مراجعة التعليقات قبل نشرها</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="appSettings.moderateComments" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <button class="btn-primary">
            حفظ الإعدادات
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card border-2 border-red-200">
        <h2 class="text-xl font-bold text-red-600 mb-6">منطقة الخطر</h2>
        <div class="space-y-4">
          <div class="p-4 bg-red-50 rounded-lg">
            <h3 class="font-medium text-red-900 mb-2">حذف جميع البيانات</h3>
            <p class="text-sm text-red-700 mb-4">
              هذا الإجراء سيحذف جميع المستخدمين والمنشورات والتعليقات. لا يمكن التراجع عن هذا الإجراء!
            </p>
            <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              حذف جميع البيانات
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const accountSettings = ref({
  name: 'المدير',
  phone: '07701234567',
  email: 'admin@athar.com',
})

const securitySettings = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const appSettings = ref({
  allowRegistration: true,
  moderatePosts: false,
  moderateComments: false,
})
</script>