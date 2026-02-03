<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إبلاغات المستخدمين</h1>
      <div class="flex gap-2">
        <select v-model="filterStatus" class="input-field py-1" @change="fetchReports">
          <option value="">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="reviewed">تمت المراجعة</option>
          <option value="resolved">تم الحل</option>
          <option value="dismissed">تم التجاهل</option>
        </select>
        <select v-model="filterType" class="input-field py-1" @change="fetchReports">
          <option value="">كل الأنواع</option>
          <option value="post">منشورات</option>
          <option value="user">حسابات</option>
          <option value="comment">تعليقات</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
    </div>

    <div v-else-if="reports.length === 0" class="bg-white rounded-xl p-12 text-center shadow-sm">
      <h3 class="text-lg font-medium text-gray-900">لا يوجد إبلاغات حالياً</h3>
      <p class="text-gray-500 mt-1">لم يتم العثور على أي إبلاغات مطابقة لهذا البحث</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <table class="w-full text-right">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">المبلغ</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">النوع</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">الهدف</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">السبب</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">الحالة</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">التاريخ</th>
            <th class="px-6 py-4 text-sm font-bold text-gray-700">إجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ report.reporter_name }}</div>
              <div class="text-xs text-gray-500">{{ report.reporter_phone }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="getTypeClass(report.type)">
                {{ getTypeText(report.type) }}
              </span>
            </td>
            <td class="px-6 py-4 max-w-xs truncate">
              <div class="text-sm text-gray-900 font-medium">#{{ report.target_id }}</div>
              <div class="text-xs text-gray-500 truncate">{{ getTargetSummary(report) }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ report.reason }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(report.status)">
                {{ getStatusText(report.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(report.created_at) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <button @click="viewReport(report)" class="text-primary-200 hover:text-primary-300 font-bold text-sm text-right">
                  مراجعة تفصيلية
                </button>
                <router-link v-if="report.type === 'user'" :to="'/users?search=' + report.target_id" class="text-xs text-blue-500 hover:underline text-right">
                  انتقال للحساب
                </router-link>
                <router-link v-if="report.type === 'post'" :to="'/posts?search=' + report.target_id" class="text-xs text-blue-500 hover:underline text-right">
                  عرض المنشور
                </router-link>
                <router-link v-if="report.type === 'comment'" :to="'/comments?search=' + report.target_id" class="text-xs text-blue-500 hover:underline text-right">
                  عرض التعليق
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Review Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">تفاصيل الإبلاغ</h2>
          
          <div v-if="selectedReport" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p class="text-xs text-gray-500 mb-1">المُبلّغ</p>
                <p class="font-bold text-gray-900">{{ selectedReport.reporter_name }}</p>
                <p class="text-sm text-gray-600">{{ selectedReport.reporter_phone }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p class="text-xs text-gray-500 mb-1">المُستهدف</p>
                <p class="font-bold text-gray-900">{{ getTypeText(selectedReport.type) }}</p>
                <p class="text-sm text-gray-600">رقم التعريف: {{ selectedReport.target_id }}</p>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p class="text-xs text-gray-500 mb-1">السبب والوصف</p>
              <p class="font-bold text-gray-900 mb-2">{{ selectedReport.reason }}</p>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedReport.description || 'لا يوجد وصف إضافي' }}</p>
            </div>

            <div v-if="selectedReport.target_data" class="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <p class="text-xs text-primary-200 mb-2 font-bold">محتوى الهدف</p>
              <div v-if="selectedReport.type === 'post'" class="text-sm">
                <p class="font-bold mb-1">{{ selectedReport.target_data.title }}</p>
                <p class="text-gray-700">{{ selectedReport.target_data.content }}</p>
              </div>
              <div v-else-if="selectedReport.type === 'user'" class="text-sm">
                <p class="font-bold mb-1">الاسم: {{ selectedReport.target_data.name }}</p>
                <p class="text-gray-700">رقم الهاتف: {{ selectedReport.target_data.phone }}</p>
              </div>
              <div v-else-if="selectedReport.type === 'comment'" class="text-sm">
                <p class="text-gray-700">{{ selectedReport.target_data.content }}</p>
              </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-100">
              <label class="block text-sm font-medium text-gray-700">ملاحظات الإدارة</label>
              <textarea 
                v-model="adminNotes" 
                class="input-field h-24"
                placeholder="أضف ملاحظات المراجعة أو الإجراء المتخذ..."
              ></textarea>
              
              <div class="flex gap-2">
                <button 
                  @click="updateStatus('resolved')" 
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                >
                  تم الحل / اتخاذ إجراء
                </button>
                <button 
                  @click="updateStatus('dismissed')" 
                  class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                >
                  تجاهل البلاغ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/reports`
const token = localStorage.getItem('admin_token')

const reports = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const selectedReport = ref<any>(null)
const adminNotes = ref('')
const filterStatus = ref('')
const filterType = ref('')

const fetchReports = async () => {
  try {
    loading.value = true
    const params = {
      status: filterStatus.value,
      type: filterType.value
    }
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    if (response.data.success) {
      reports.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
  } finally {
    loading.value = false
  }
}

const viewReport = (report: any) => {
  selectedReport.value = report
  adminNotes.value = report.admin_notes || ''
  showModal.value = true
}

const updateStatus = async (status: string) => {
  try {
    const response = await axios.put(`${API_URL}/admin/${selectedReport.value.id}/status`, {
      status,
      admin_notes: adminNotes.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      showModal.value = false
      fetchReports()
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('فشل تحديث حالة الإبلاغ')
  }
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: 'قيد الانتظار',
    reviewed: 'تمت المراجعة',
    resolved: 'تم الحل',
    dismissed: 'تم التجاهل'
  }
  return map[status] || status
}

const getStatusClass = (status: string) => {
  const base = 'px-2 py-1 text-xs rounded-full font-medium'
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-700'
  }
  return `${base} ${map[status] || 'bg-gray-100 text-gray-800'}`
}

const getTypeClass = (type: string) => {
  const base = 'px-2 py-1 text-xs rounded-full font-medium'
  const map: Record<string, string> = {
    post: 'bg-blue-100 text-blue-700',
    user: 'bg-green-100 text-green-700',
    comment: 'bg-orange-100 text-orange-700'
  }
  return `${base} ${map[type] || 'bg-gray-100 text-gray-700'}`
}

const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    post: 'منشور',
    user: 'حساب',
    comment: 'تعليق'
  }
  return map[type] || type
}

const getTargetSummary = (report: any) => {
  if (!report.target_data) return `المعرف #${report.target_id}`
  if (report.type === 'post') return report.target_data.title || report.target_data.content
  if (report.type === 'user') return report.target_data.name
  if (report.type === 'comment') return report.target_data.content
  return `المعرف #${report.target_id}`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(fetchReports)
</script>
