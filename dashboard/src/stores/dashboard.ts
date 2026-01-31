import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface Stats {
  totalUsers: number
  totalPosts: number
  totalComments: number
  totalLikes: number
  newUsersToday: number
  newPostsToday: number
  postsByType: any[]
  postsByCategory: any[]
  recentActivity: any[]
}

interface DashboardState {
  stats: Stats
  recentUsers: any[]
  recentPosts: any[]
  isLoading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0,
      newUsersToday: 0,
      newPostsToday: 0,
      postsByType: [],
      postsByCategory: [],
      recentActivity: [],
    },
    recentUsers: [],
    recentPosts: [],
    isLoading: false,
  }),

  actions: {
    async fetchStats() {
      this.isLoading = true
      try {
        const response = await axios.get(`${API_URL}/admin/stats`)

        if (response.data.success) {
          this.stats = response.data.data
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchRecentUsers() {
      try {
        const response = await axios.get(`${API_URL}/admin/users/recent`)

        if (response.data.success) {
          this.recentUsers = response.data.data
        }
      } catch (error) {
        console.error('Error fetching recent users:', error)
      }
    },

    async fetchRecentPosts() {
      try {
        const response = await axios.get(`${API_URL}/admin/posts/recent`)

        if (response.data.success) {
          this.recentPosts = response.data.data
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error)
      }
    },
  },
})