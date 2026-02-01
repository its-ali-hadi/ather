import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface User {
  id: number
  name: string
  phone: string
  email?: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('admin_token'),
    isAuthenticated: !!localStorage.getItem('admin_token'),
  }),

  actions: {
    async login(phone: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          phone,
          password,
        })

        if (response.data.success) {
          const { token, user } = response.data.data

          // Check if user is admin
          if (user.role !== 'admin') {
            return {
              success: false,
              message: 'غير مصرح لك بالوصول إلى لوحة التحكم',
            }
          }

          this.token = token
          this.user = user
          this.isAuthenticated = true

          localStorage.setItem('admin_token', token)
          localStorage.setItem('admin_user', JSON.stringify(user))

          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return {
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
          }
        }

        return {
          success: false,
          message: response.data.message || 'فشل تسجيل الدخول',
        }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول',
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      delete axios.defaults.headers.common['Authorization']
    },

    async checkAuth() {
      const token = localStorage.getItem('admin_token')
      const userStr = localStorage.getItem('admin_user')

      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return true
        } catch (error) {
          this.logout()
          return false
        }
      }

      return false
    },
  },
})