<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">إدارة المنشورات</h1>
      <p class="text-gray-600">عرض وإدارة جميع المنشورات</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث بالعنوان، المضمون، أو المعرف (ID)..."
            class="input-field"
            @input="handleSearch"
          />
        </div>
        <select v-model="typeFilter" @change="handleSearch" class="input-field md:w-48">
          <option value="">جميع الأنواع</option>
          <option value="text">نص</option>
          <option value="image">صورة</option>
          <option value="video">فيديو</option>
          <option value="link">رابط</option>
        </select>
        <select v-model="categoryFilter" @change="handleSearch" class="input-field md:w-48">
          <option value="">جميع التصنيفات</option>
          <option value="تقنية">تقنية</option>
          <option value="فن">فن</option>
          <option value="أدب">أدب</option>
          <option value="رياضة">رياضة</option>
          <option value="سفر">سفر</option>
          <option value="أعمال">أعمال</option>
        </select>
        <button @click="fetchPosts" class="btn-primary">
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

    <!-- Posts Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرقم #</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنشور</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكاتب</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التصنيف</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإعجابات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التعليقات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                #{{ post.id }}
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900 line-clamp-1">{{ post.title }}</p>
                  <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ post.content }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(post.created_at) }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ post.author_name?.charAt(0) }}</span>
                  </div>
                  <span class="text-sm text-gray-900">{{ post.author_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeBadgeClass(post.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getTypeLabel(post.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ post.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ post.likes_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ post.comments_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="handleDeletePost(post.id)"
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
            عرض {{ posts.length }} من أصل {{ pagination.total }} منشور
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

const posts = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const categoryFilter = ref('')
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

const fetchPosts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/admin/posts`, {
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
        type: typeFilter.value,
        category: categoryFilter.value,
      }
    })

    if (response.data.success) {
      posts.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    alert('فشل جلب المنشورات')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchPosts()
}

const goToPage = (page: number) => {
  pagination.value.page = page
  fetchPosts()
}

const handleDeletePost = async (postId: number) => {
  if (!confirm('هل أنت متأكد من حذف هذا المنشور؟ هذا الإجراء لا يمكن التراجع عنه!')) return

  try {
    const response = await axios.delete(`${API_URL}/admin/posts/${postId}`)
    
    if (response.data.success) {
      alert('تم حذف المنشور بنجاح')
      fetchPosts()
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('فشل حذف المنشور')
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    text: 'نص',
    image: 'صورة',
    video: 'فيديو',
    link: 'رابط',
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    text: 'bg-blue-100 text-blue-800',
    image: 'bg-green-100 text-green-800',
    video: 'bg-purple-100 text-purple-800',
    link: 'bg-orange-100 text-orange-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
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
  fetchPosts()
})
</script>