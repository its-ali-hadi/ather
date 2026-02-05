<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-primary-900 mb-2">إدارة الفئات</h1>
        <p class="text-gray-600">إدارة فئات المنشورات</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة فئة جديدة
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Categories Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصندوق</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنشورات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الترتيب</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    :style="{ backgroundColor: category.color + '20', color: category.color }"
                  >
                    {{ category.icon }}
                  </div>
                  <span class="font-medium text-gray-900">{{ category.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ category.box_name || '-' }}</td>
              <td class="px-6 py-4 text-gray-600">{{ category.posts_count }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ category.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ category.order_index }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="editCategory(category)"
                    class="text-primary-600 hover:text-primary-700"
                  >
                    تعديل
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="text-red-600 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
          {{ showEditModal ? 'تعديل الفئة' : 'إضافة فئة جديدة' }}
        </h2>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الفئة</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input"
              placeholder="مثال: برمجة"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="input"
              placeholder="وصف مختصر عن الفئة"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الصندوق</label>
            <select v-model="formData.box_id" class="input">
              <option :value="null">بدون صندوق</option>
              <option v-for="box in boxes" :key="box.id" :value="box.id">
                {{ box.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الأيقونة</label>
              <input
                v-model="formData.icon"
                type="text"
                class="input"
                placeholder="code"
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
              id="is_active_cat"
              class="w-4 h-4 text-primary-600 rounded"
            />
            <label for="is_active_cat" class="text-sm font-medium text-gray-700">
              نشط
            </label>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <button type="submit" class="flex-1 btn-primary">
              {{ showEditModal ? 'حفظ التعديلات' : 'إضافة الفئة' }}
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

const categories = ref<any[]>([])
const boxes = ref<any[]>([])
const isLoading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref<any>(null)

const formData = ref({
  name: '',
  description: '',
  icon: '',
  color: '#3B82F6',
  box_id: null,
  is_active: true,
  order_index: 0,
})

onMounted(async () => {
  await Promise.all([loadCategories(), loadBoxes()])
})

const loadCategories = async () => {
  try {
    isLoading.value = true
    const token = localStorage.getItem('admin_token')
    const response = await axios.get(`${API_URL}/boxes/admin/categories/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    categories.value = response.data.data
  } catch (error) {
    console.error('Error loading categories:', error)
    alert('فشل تحميل الفئات')
  } finally {
    isLoading.value = false
  }
}

const loadBoxes = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await axios.get(`${API_URL}/boxes/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    boxes.value = response.data.data
  } catch (error) {
    console.error('Error loading boxes:', error)
  }
}

const editCategory = (category: any) => {
  editingCategory.value = category
  formData.value = { ...category }
  showEditModal.value = true
}

const saveCategory = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    
    if (showEditModal.value && editingCategory.value) {
      await axios.put(
        `${API_URL}/boxes/admin/categories/${editingCategory.value.id}`,
        formData.value,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('تم تحديث الفئة بنجاح')
    } else {
      await axios.post(
        `${API_URL}/boxes/admin/categories`,
        formData.value,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('تم إضافة الفئة بنجاح')
    }
    
    closeModal()
    await loadCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('فشل حفظ الفئة')
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return
  
  try {
    const token = localStorage.getItem('admin_token')
    await axios.delete(`${API_URL}/boxes/admin/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert('تم حذف الفئة بنجاح')
    await loadCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('فشل حذف الفئة')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    box_id: null,
    is_active: true,
    order_index: 0,
  }
}
</script>