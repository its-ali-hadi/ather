<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">إرسال الإشعارات</h1>
      <p class="text-gray-600">إرسال إشعارات للمستخدمين</p>
    </div>

    <!-- Send Notification Form -->
    <div class="card mb-8">
      <h2 class="text-xl font-bold text-primary-900 mb-6">إشعار جديد</h2>

      <form @submit.prevent="handleSendNotification" class="space-y-6">
        <!-- Target Users -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">المستلمون</label>
          <select v-model="notificationForm.target" class="input-field" required>
            <option value="all">جميع المستخدمين</option>
            <option value="specific">مستخدمون محددون</option>
          </select>
        </div>

        <!-- Specific Users (if selected) -->
        <div v-if="notificationForm.target === 'specific'">
          <label class="block text-sm font-medium text-gray-700 mb-2">معرفات المستخدمين (مفصولة بفواصل)</label>
          <input
            v-model="notificationForm.userIds"
            type="text"
            placeholder="1, 2, 3, 4"
            class="input-field"
            required
          />
          <p class="text-xs text-gray-500 mt-1">أدخل معرفات المستخدمين مفصولة بفواصل</p>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
          <input
            v-model="notificationForm.title"
            type="text"
            placeholder="عنوان الإشعار"
            class="input-field"
            required
            maxlength="100"
          />
        </div>

        <!-- Body -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
          <textarea
            v-model="notificationForm.body"
            placeholder="محتوى الإشعار"
            class="input-field"
            rows="4"
            required
            maxlength="500"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ notificationForm.body.length }}/500 حرف</p>
        </div>

        <!-- Action Data (Optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">بيانات إضافية (اختياري)</label>
          <textarea
            v-model="notificationForm.data"
            placeholder='{"screen": "PostDetail", "postId": "123"}'
            class="input-field font-mono text-sm"
            rows="3"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">JSON format للتنقل أو بيانات إضافية</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            type="submit"
            class="btn-primary"
            :disabled="isSending"
          >
            <svg v-if="!isSending" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span v-if="!isSending">إرسال الإشعار</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 ml-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإرسال...
            </span>
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            إعادة تعيين
          </button>
        </div>
      </form>
    </div>

    <!-- Notification Templates -->
    <div class="card">
      <h3 class="text-lg font-bold text-primary-900 mb-4">قوالب جاهزة</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          @click="applyTemplate(template)"
          class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
        >
          <h4 class="font-medium text-gray-900 mb-1">{{ template.title }}</h4>
          <p class="text-sm text-gray-600">{{ template.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const notificationForm = ref({
  target: 'all',
  userIds: '',
  title: '',
  body: '',
  data: '',
})

const isSending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const templates = [
  {
    id: 1,
    title: 'ترحيب بالمستخدمين الجدد',
    body: 'مرحباً بك في أثر! نتمنى لك تجربة رائعة في مشاركة أفكارك واكتشاف محتوى جديد.',
  },
  {
    id: 2,
    title: 'تحديث جديد',
    body: 'تم إضافة ميزات جديدة رائعة! تحقق من آخر التحديثات الآن.',
  },
  {
    id: 3,
    title: 'تذكير بالنشاط',
    body: 'لم نراك منذ فترة! عد واكتشف المنشورات الجديدة من المستخدمين الذين تتابعهم.',
  },
  {
    id: 4,
    title: 'إعلان مهم',
    body: 'لدينا إعلان مهم! تحقق من التطبيق لمعرفة المزيد.',
  },
]

const handleSendNotification = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSending.value = true

  try {
    // Parse user IDs if specific target
    let userIds: any = 'all'
    if (notificationForm.value.target === 'specific') {
      userIds = notificationForm.value.userIds
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))

      if (userIds.length === 0) {
        errorMessage.value = 'الرجاء إدخال معرفات مستخدمين صحيحة'
        isSending.value = false
        return
      }
    }

    // Parse data JSON if provided
    let data = null
    if (notificationForm.value.data.trim()) {
      try {
        data = JSON.parse(notificationForm.value.data)
      } catch (e) {
        errorMessage.value = 'البيانات الإضافية يجب أن تكون بصيغة JSON صحيحة'
        isSending.value = false
        return
      }
    }

    const response = await axios.post(`${API_URL}/admin/notifications/send`, {
      userIds,
      title: notificationForm.value.title,
      body: notificationForm.value.body,
      data,
    })

    if (response.data.success) {
      successMessage.value = response.data.message
      resetForm()
    } else {
      errorMessage.value = response.data.message || 'فشل إرسال الإشعار'
    }
  } catch (error: any) {
    console.error('Error sending notification:', error)
    errorMessage.value = error.response?.data?.message || 'حدث خطأ أثناء إرسال الإشعار'
  } finally {
    isSending.value = false
  }
}

const resetForm = () => {
  notificationForm.value = {
    target: 'all',
    userIds: '',
    title: '',
    body: '',
    data: '',
  }
  errorMessage.value = ''
  successMessage.value = ''
}

const applyTemplate = (template: any) => {
  notificationForm.value.title = template.title
  notificationForm.value.body = template.body
}
</script>