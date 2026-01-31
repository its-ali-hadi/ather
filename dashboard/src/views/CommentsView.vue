<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">إدارة التعليقات</h1>
      <p class="text-gray-600">عرض وإدارة جميع التعليقات</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث عن تعليق..."
            class="input-field"
            @input="handleSearch"
          />
        </div>
        <button @click="fetchComments" class="btn-primary">
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          تحديث
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Comments Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التعليق</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكاتب</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنشور</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="comment in comments" :key="comment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900 line-clamp-3">{{ comment.content }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ comment.author_name?.charAt(0) }}</span>
                  </div>
                  <span class="text-sm text-gray-900">{{ comment.author_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900 line-clamp-2">{{ comment.post_title }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(comment.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="handleDeleteComment(comment.id)"
                  class="text-red-600 hover:text-red-800"
                  title="حذف"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">
            عرض {{ comments.length }} من أصل {{ pagination.total }} تعليق
          </p>
          <div class="flex gap-2">
            <button
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              السابق
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="page === pagination.page ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-3 py-1 border border-gray-300 rounded-lg"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const comments = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.value.page - 2)
  const end = Math.min(pagination.value.totalPages, pagination.value.page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const fetchComments = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/admin/comments`, {
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
      }
    })

    if (response.data.success) {
      comments.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    alert('فشل جلب التعليقات')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchComments()
}

const goToPage = (page: number) => {
  pagination.value.page = page
  fetchComments()
}

const handleDeleteComment = async (commentId: number) => {
  if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return

  try {
    const response = await axios.delete(`${API_URL}/admin/comments/${commentId}`)
    
    if (response.data.success) {
      alert('تم حذف التعليق بنجاح')
      fetchComments()
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    alert('فشل حذف التعليق')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchComments()
})
</script>