<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-primary-900 mb-2">إدارة الصناديق</h1>
        <p class="text-gray-600">إدارة صناديق الأفكار والفئات</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة صندوق جديد
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Boxes Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="box in boxes"
        :key="box.id"
        class="card hover:shadow-lg transition-shadow"
      >
        <!-- Box Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: box.color + '20' }"
            >
              <svg class="w-6 h-6" :style="{ color: box.color }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ box.name }}</h3>
              <p class="text-sm text-gray-500">{{ box.posts_count }} منشور</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 text-xs rounded-full',
              box.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            ]"
          >
            {{ box.is_active ? 'نشط' : 'غير نشط' }}
          </span>
        </div>

        <!-- Box Description -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ box.description }}</p>

        <!-- Box Actions -->
        <div class="flex items-center gap-2">
          <button
            @click="editBox(box)"
            class="flex-1 btn-secondary text-sm"
          >
            تعديل
          </button>
          <button
            @click="toggleBoxStatus(box)"
            class="flex-1 btn-secondary text-sm"
          >
            {{ box.is_active ? 'إيقاف' : 'تفعيل' }}
          </button>
          <button
            @click="deleteBox(box.id)"
            class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
          >
            حذف
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ showEditModal ? 'تعديل الصندوق' : 'إضافة صندوق جديد' }}
        </h2>

        <form @submit.prevent="saveBox" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الصندوق</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input"
              placeholder="مثال: صندوق التقنية والبرمجة"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="input"
              placeholder="وصف مختصر عن الصندوق"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الأيقونة</label>
              <input
                v-model="formData.icon"
                type="text"
                class="input"
                placeholder="code-slash"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اللون</label>
              <input
                v-model="formData.color"
                type="color"
                class="input h-10"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
            <input
              v-model="formData.image_url"
              type="url"
              class="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ترتيب العرض</label>
            <input
              v-model.number="formData.order_index"
              type="number"
              class="input"
              placeholder="0"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-primary-600 rounded"
            />
            <label for="is_active" class="text-sm font-medium text-gray-700">
              نشط
            </label>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <button type="submit" class="flex-1 btn-primary">
              {{ showEditModal ? 'حفظ التعديلات' : 'إضافة الصندوق' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://athar-api.alihadi.click/api'

const boxes = ref<any[]>([])
const isLoading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingBox = ref<any>(null)

const formData = ref({
  name: '',
  description: '',
  icon: '',
  image_url: '',
  color: '#3B82F6',
  is_active: true,
  order_index: 0,
})

onMounted(async () => {
  await loadBoxes()
})

const loadBoxes = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('admin_token')
    const response = await axios.get(`${API_URL}/boxes/admin/all`)
    boxes.value = response.data.data
  } catch (error) {
    console.error('Error loading boxes:', error)
    alert('فشل تحميل الصناديق')
  } finally {
    isLoading.value = false
  }
}

const editBox = (box: any) => {
  editingBox.value = box
  formData.value = { ...box }
  showEditModal.value = true
}

const saveBox = async () => {
  try {
    const token = localStorage.getItem('token')
    
    if (showEditModal.value && editingBox.value) {
      await axios.put(
        `${API_URL}/boxes/admin/${editingBox.value.id}`,
        formData.value
      )
      alert('تم تحديث الصندوق بنجاح')
    } else {
      await axios.post(
        `${API_URL}/boxes/admin`,
        formData.value
      )
      alert('تم إضافة الصندوق بنجاح')
    }
    
    closeModal()
    await loadBoxes()
  } catch (error) {
    console.error('Error saving box:', error)
    alert('فشل حفظ الصندوق')
  }
}

const toggleBoxStatus = async (box: any) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `${API_URL}/boxes/admin/${box.id}`,
      { ...box, is_active: !box.is_active }
    )
    await loadBoxes()
  } catch (error) {
    console.error('Error toggling box status:', error)
    alert('فشل تغيير حالة الصندوق')
  }
}

const deleteBox = async (id: number) => {
  if (!confirm('هل أنت متأكد من حذف هذا الصندوق؟')) return
  
  try {
    await axios.delete(`${API_URL}/boxes/admin/${id}`)
    alert('تم حذف الصندوق بنجاح')
    await loadBoxes()
  } catch (error) {
    console.error('Error deleting box:', error)
    alert('فشل حذف الصندوق')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingBox.value = null
  formData.value = {
    name: '',
    description: '',
    icon: '',
    image_url: '',
    color: '#3B82F6',
    is_active: true,
    order_index: 0,
  }
}
</script>