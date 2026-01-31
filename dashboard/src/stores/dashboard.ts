import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0
  })

  const recentUsers = ref([])
  const recentPosts = ref([])
  const isLoading = ref(false)

  async function fetchStats() {
    isLoading.value = true
    try {
      const response = await axios.get(`${API_URL}/admin/stats`)
      if (response.data.success) {
        stats.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRecentUsers() {
    try {
      const response = await axios.get(`${API_URL}/admin/users/recent`)
      if (response.data.success) {
        recentUsers.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching recent users:', error)
    }
  }

  async function fetchRecentPosts() {
    try {
      const response = await axios.get(`${API_URL}/admin/posts/recent`)
      if (response.data.success) {
        recentPosts.value = response.data.data
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error)
    }
  }

  return {
    stats,
    recentUsers,
    recentPosts,
    isLoading,
    fetchStats,
    fetchRecentUsers,
    fetchRecentPosts
  }
})