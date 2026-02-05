<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إدارة البنرات</h1>
      <button @click="openAddModal" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة بنر جديد
      </button>
    </div>

    <!-- Banners Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
    </div>

    <div v-else-if="banners.length === 0" class="bg-white rounded-xl p-12 text-center shadow-sm">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">لا يوجد بنرات حالياً</h3>
      <p class="text-gray-500 mt-1">ابدأ بإضافة أول بنر لعرضه في التطبيق</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="banner in banners"
        :key="banner.id"
        class="card hover:shadow-lg transition-shadow overflow-hidden"
      >
        <div class="relative h-44 -mx-6 -mt-6 mb-4 bg-gray-200 overflow-hidden">
          <img 
            :src="getFileUrl(banner.image_url)" 
            class="absolute inset-0 w-full h-full object-cover"
            alt="Banner Preview"
            @error="(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Error+Loading+Image'"
          />
          <div class="absolute top-2 right-2 flex gap-1">
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full font-medium',
                banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              ]"
            >
              {{ banner.is_active ? 'نشط' : 'غير نشط' }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-200">
            <i :class="`icon-${banner.icon || 'bulb'}`"></i>
            <svg v-if="!banner.icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900">{{ banner.title }}</h3>
        </div>

        <div class="text-sm text-gray-500 mb-6 truncate">
          <span class="font-medium text-gray-700">رابط التوجيه:</span> {{ banner.target_url || 'لا يوجد' }}
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <div class="flex gap-2 text-right">
            <button
              @click="toggleBannerStatus(banner)"
              class="p-2 rounded-lg transition-colors"
              :class="banner.is_active ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'"
              :title="banner.is_active ? 'تعطيل' : 'تفعيل'"
            >
              <svg v-if="banner.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              @click="editBanner(banner)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تعديل"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(banner)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 4s5 0 8 0" />
              </svg>
            </button>
          </div>
          <div class="text-xs text-gray-400">الترتيب: {{ banner.order_index }}</div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="showModal = false"></div>

        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            {{ isEditing ? 'تعديل البنر' : 'إضافة بنر جديد' }}
          </h2>

          <form @submit.prevent="saveBanner" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان البنر</label>
              <input
                v-model="formData.title"
                type="text"
                class="input-field"
                placeholder="مثال: اكتشف مواضيع جديدة"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الأيقونة (اختياري)</label>
              <input
                v-model="formData.icon"
                type="text"
                class="input-field"
                placeholder="اسم الأيقونة (مثال: bulb, home, person)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">رابط التوجيه (اختياري)</label>
              <input
                v-model="formData.target_url"
                type="text"
                class="input-field"
                placeholder="مثال: /explore أو رابط خارجي"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">صورة البنر</label>
              <div v-if="imagePreview || formData.image_url" class="mb-2 relative h-32 rounded-lg overflow-hidden border border-gray-200">
                <img :src="imagePreview || getFileUrl(formData.image_url)" class="w-full h-full object-cover" />
                <button 
                  type="button"
                  @click="removeImage"
                  class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                class="hidden"
              />
              <button 
                type="button"
                @click="$refs.fileInput.click()"
                class="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-200 hover:text-primary-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ (imagePreview || formData.image_url) ? 'تغيير الصورة' : 'اختر صورة من جهازك' }}
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                <input
                  v-model.number="formData.order_index"
                  type="number"
                  class="input-field"
                  placeholder="0"
                />
              </div>
              <div class="flex items-end pb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="formData.is_active"
                    type="checkbox"
                    class="w-5 h-5 text-primary-200 border-gray-300 rounded focus:ring-primary-200"
                  />
                  <span class="text-sm font-medium text-gray-700">تفعيل البنر</span>
                </label>
              </div>
            </div>

            <div class="flex gap-3 pt-6">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <div v-if="saving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {{ isEditing ? 'تحديث البنر' : 'إضافة البنر' }}
              </button>
              <button
                type="button"
                @click="showModal = false"
                class="flex-1 btn-secondary py-3"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://athar-api.alihadi.click/api'

const banners = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const formData = ref({
  id: null,
  title: '',
  icon: '',
  target_url: '',
  image_url: '',
  is_active: true,
  order_index: 0
})

const getFileUrl = (url: string) => {
  if (!url) return 'https://via.placeholder.com/800x400?text=No+Image'
  if (url.startsWith('http')) return url
  const serverUrl = BASE_URL.replace('/api', '')
  const cleanBase = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${cleanBase}${cleanPath}`
}

const fetchBanners = async () => {
  try {
    loading.value = true
    const response = await axios.get('/banners/admin')
    if (response.data.success) {
      banners.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  selectedFile.value = null
  imagePreview.value = null
  formData.value = {
    id: null,
    title: '',
    icon: '',
    target_url: '',
    image_url: '',
    is_active: true,
    order_index: banners.value.length
  }
  showModal.value = true
}

const editBanner = (banner: any) => {
  isEditing.value = true
  selectedFile.value = null
  imagePreview.value = null
  formData.value = { ...banner }
  showModal.value = true
}

const handleFileChange = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  formData.value.image_url = ''
  if (fileInput.value) fileInput.value.value = ''
}

const saveBanner = async () => {
  try {
    saving.value = true
    const data = new FormData()
    data.append('title', formData.value.title)
    data.append('icon', formData.value.icon || '')
    data.append('target_url', formData.value.target_url || '')
    data.append('is_active', String(formData.value.is_active))
    data.append('order_index', String(formData.value.order_index))
    
    if (selectedFile.value) {
      data.append('image', selectedFile.value)
    } else {
      data.append('image_url', formData.value.image_url)
    }

    let response: any
    if (isEditing.value) {
      response = await axios.put(`/banners/admin/${formData.value.id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      response = await axios.post('/banners/admin', data, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    if (response.data.success) {
      showModal.value = false
      fetchBanners()
    }
  } catch (error) {
    console.error('Error saving banner:', error)
    alert('حدث خطأ أثناء حفظ البنر')
  } finally {
    saving.value = false
  }
}

const toggleBannerStatus = async (banner: any) => {
  try {
    const data = new FormData()
    data.append('title', banner.title)
    data.append('is_active', String(!banner.is_active))
    data.append('order_index', String(banner.order_index))
    data.append('icon', banner.icon || '')
    data.append('target_url', banner.target_url || '')
    data.append('image_url', banner.image_url)

    const response = await axios.put(`/banners/admin/${banner.id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.success) {
      await fetchBanners()
    }
  } catch (error) {
    console.error('Error toggling banner status:', error)
    alert('فشل تغيير حالة البنر')
  }
}

const confirmDelete = async (banner: any) => {
  if (confirm(`هل أنت متأكد من حذف البنر "${banner.title}"؟`)) {
    try {
      const response = await axios.delete(`/banners/admin/${banner.id}`)
      if (response.data.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('حدث خطأ أثناء حذف البنر')
    }
  }
}

onMounted(fetchBanners)
</script>
