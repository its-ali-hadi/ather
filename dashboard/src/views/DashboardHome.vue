<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-2">لوحة التحكم</h1>
      <p class="text-gray-600">مرحباً بك في لوحة تحكم أثر</p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="إجمالي المستخدمين"
        :value="dashboardStore.stats.totalUsers"
        icon="users"
        color="blue"
        :change="dashboardStore.stats.newUsersToday"
        changeLabel="مستخدم جديد اليوم"
      />
      <StatsCard
        title="إجمالي المنشورات"
        :value="dashboardStore.stats.totalPosts"
        icon="posts"
        color="green"
        :change="dashboardStore.stats.newPostsToday"
        changeLabel="منشور جديد اليوم"
      />
      <StatsCard
        title="إجمالي التعليقات"
        :value="dashboardStore.stats.totalComments"
        icon="comments"
        color="purple"
      />
      <StatsCard
        title="إجمالي الإعجابات"
        :value="dashboardStore.stats.totalLikes"
        icon="heart"
        color="red"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Posts by Type -->
      <div class="card">
        <h3 class="text-lg font-bold text-primary-900 mb-4">المنشورات حسب النوع</h3>
        <div v-if="postsByTypeData.length > 0" class="h-64">
          <DoughnutChart :data="postsByTypeChartData" :options="chartOptions" />
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات
        </div>
      </div>

      <!-- Posts by Category -->
      <div class="card">
        <h3 class="text-lg font-bold text-primary-900 mb-4">أكثر التصنيفات</h3>
        <div v-if="postsByCategoryData.length > 0" class="h-64">
          <BarChart :data="postsByCategoryChartData" :options="chartOptions" />
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="card mb-8">
      <h3 class="text-lg font-bold text-primary-900 mb-4">النشاط الأخير (آخر 7 أيام)</h3>
      <div v-if="recentActivityData.length > 0" class="h-64">
        <LineChart :data="recentActivityChartData" :options="chartOptions" />
      </div>
      <div v-else class="h-64 flex items-center justify-center text-gray-500">
        لا توجد بيانات
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-primary-900">مستخدمون جدد</h3>
          <router-link to="/users" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
            عرض الكل ←
          </router-link>
        </div>
        <div class="space-y-3">
          <div
            v-for="user in dashboardStore.recentUsers"
            :key="user.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
              <span class="text-white font-bold">{{ user.name.charAt(0) }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(user.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-primary-900">منشورات جديدة</h3>
          <router-link to="/posts" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
            عرض الكل ←
          </router-link>
        </div>
        <div class="space-y-3">
          <div
            v-for="post in dashboardStore.recentPosts"
            :key="post.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 truncate">{{ post.title }}</p>
              <p class="text-xs text-gray-500">{{ post.author_name }} • {{ formatDate(post.created_at) }}</p>
            </div>
            <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {{ getTypeLabel(post.type) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import StatsCard from '@/components/StatsCard.vue'
import { Doughnut as DoughnutChart, Bar as BarChart, Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchStats()
  await dashboardStore.fetchRecentUsers()
  await dashboardStore.fetchRecentPosts()
})

const postsByTypeData = computed(() => dashboardStore.stats.postsByType || [])
const postsByCategoryData = computed(() => dashboardStore.stats.postsByCategory || [])
const recentActivityData = computed(() => dashboardStore.stats.recentActivity || [])

const postsByTypeChartData = computed(() => ({
  labels: postsByTypeData.value.map((item: any) => getTypeLabel(item.type)),
  datasets: [{
    data: postsByTypeData.value.map((item: any) => item.count),
    backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
  }]
}))

const postsByCategoryChartData = computed(() => ({
  labels: postsByCategoryData.value.map((item: any) => item.category),
  datasets: [{
    label: 'عدد المنشورات',
    data: postsByCategoryData.value.map((item: any) => item.count),
    backgroundColor: '#E8B86D',
  }]
}))

const recentActivityChartData = computed(() => ({
  labels: recentActivityData.value.map((item: any) => formatDate(item.date)),
  datasets: [{
    label: 'المنشورات',
    data: recentActivityData.value.map((item: any) => item.count),
    borderColor: '#E8B86D',
    backgroundColor: 'rgba(232, 184, 109, 0.1)',
    tension: 0.4,
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    }
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>