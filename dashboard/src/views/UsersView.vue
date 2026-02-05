<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">إدارة المستخدمين</h1>
      <p class="text-gray-600">عرض وإدارة جميع المستخدمين</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث بالاسم، الهاتف، البريد أو المعرف (ID)..."
            class="input-field"
            @input="handleSearch"
          />
        </div>
        <button @click="fetchUsers" class="btn-primary">
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

    <!-- Users Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرقم #</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الهاتف</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنشورات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتابعون</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                #{{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">{{ user.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(user.created_at) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.posts_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.followers_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ user.is_banned ? 'محظور' : 'نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    v-if="!user.is_banned"
                    @click="handleBanUser(user.id)"
                    class="text-red-600 hover:text-red-800"
                    title="حظر"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="handleUnbanUser(user.id)"
                    class="text-green-600 hover:text-green-800"
                    title="إلغاء الحظر"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="handleDeleteUser(user.id)"
                    class="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">
            عرض {{ users.length }} من أصل {{ pagination.total }} مستخدم
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

const API_URL = import.meta.env.VITE_API_URL || 'https://athar-api.alihadi.click/api'

const users = ref<any[]>([])
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

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
      }
    })

    if (response.data.success) {
      users.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    alert('فشل جلب المستخدمين')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchUsers()
}

const goToPage = (page: number) => {
  pagination.value.page = page
  fetchUsers()
}

const handleBanUser = async (userId: number) => {
  if (!confirm('هل أنت متأكد من حظر هذا المستخدم؟')) return

  try {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/ban`)
    
    if (response.data.success) {
      alert('تم حظر المستخدم بنجاح')
      fetchUsers()
    }
  } catch (error) {
    console.error('Error banning user:', error)
    alert('فشل حظر المستخدم')
  }
}

const handleUnbanUser = async (userId: number) => {
  if (!confirm('هل أنت متأكد من إلغاء حظر هذا المستخدم؟')) return

  try {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/unban`)
    
    if (response.data.success) {
      alert('تم إلغاء حظر المستخدم بنجاح')
      fetchUsers()
    }
  } catch (error) {
    console.error('Error unbanning user:', error)
    alert('فشل إلغاء حظر المستخدم')
  }
}

const handleDeleteUser = async (userId: number) => {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه!')) return

  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`)
    
    if (response.data.success) {
      alert('تم حذف المستخدم بنجاح')
      fetchUsers()
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('فشل حذف المستخدم')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchUsers()
})
</script>