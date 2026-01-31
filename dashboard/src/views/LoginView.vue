<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full mb-4 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary-900 mb-2">أثر</h1>
        <p class="text-primary-700">لوحة تحكم الإدارة</p>
      </div>

      <!-- Login Card -->
      <div class="card">
        <h2 class="text-2xl font-bold text-primary-900 mb-6 text-center">تسجيل الدخول</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Phone Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="phone"
              type="tel"
              placeholder="07701234567"
              class="input-field"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input-field"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">تسجيل الدخول</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 ml-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحميل...
            </span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-primary-700 mt-6">
        © 2024 أثر. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await authStore.login(phone.value, password.value)

    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message || 'فشل تسجيل الدخول'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'حدث خطأ غير متوقع'
  } finally {
    isLoading.value = false
  }
}
</script>