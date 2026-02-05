import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Setup axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'https://athar-api.alihadi.click/api'
axios.defaults.baseURL = API_URL

// Add token to requests if available
const token = localStorage.getItem('admin_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Add response interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

app.use(pinia)
app.use(router)
app.mount('#app')