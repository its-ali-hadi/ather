<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ formattedValue }}</h3>
        <div v-if="change !== undefined" class="flex items-center gap-1">
          <span :class="changeColorClass" class="text-sm font-medium">
            +{{ change }}
          </span>
          <span class="text-xs text-gray-500">{{ changeLabel }}</span>
        </div>
      </div>
      <div :class="iconBgClass" class="w-12 h-12 rounded-lg flex items-center justify-center">
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number
  icon: 'users' | 'posts' | 'comments' | 'heart'
  color: 'blue' | 'green' | 'purple' | 'red'
  change?: number
  changeLabel?: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  return props.value.toLocaleString('ar-SA')
})

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  }
  return colors[props.color]
})

const changeColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
  }
  return colors[props.color]
})

const iconComponent = computed(() => {
  const icons = {
    users: IconUsers,
    posts: IconPosts,
    comments: IconComments,
    heart: IconHeart,
  }
  return icons[props.icon]
})
</script>

<script lang="ts">
const IconUsers = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `
}

const IconPosts = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const IconComments = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
}

const IconHeart = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  `
}

export default {
  components: {
    IconUsers,
    IconPosts,
    IconComments,
    IconHeart,
  }
}
</script>