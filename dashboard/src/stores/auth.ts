import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<any>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Set axios default headers
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  async function login(phone: string, password: string) {
    isLoading.value = true
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        phone,
        password
      })

      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user

        // Check if user is admin
        if (user.value.role !== 'admin') {
          throw new Error('غير مصرح لك بالوصول')
        }

        localStorage.setItem('admin_token', token.value)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        return { success: true }
      }

      return { success: false, message: response.data.message }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'حدث خطأ'
      }
    } finally {
      isLoading.value = false
    }
  }

  async function checkAuth() {
    if (!token.value) return

    try {
      const response = await axios.get(`${API_URL}/auth/me`)
      
      if (response.data.success) {
        user.value = response.data.data

        if (user.value.role !== 'admin') {
          logout()
        }
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    login,
    checkAuth,
    logout
  }
})