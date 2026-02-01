<template>
  <div class="messages-view">
    <div class="header">
      <div class="header-content">
        <h1 class="title">رسائل التواصل</h1>
        <p class="subtitle">إدارة رسائل المستخدمين</p>
      </div>
      <div class="stats-cards">
        <div class="stat-card pending">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">قيد الانتظار</span>
            <span class="stat-value">{{ counts.pending }}</span>
          </div>
        </div>
        <div class="stat-card read">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">مقروءة</span>
            <span class="stat-value">{{ counts.read }}</span>
          </div>
        </div>
        <div class="stat-card replied">
          <div class="stat-icon">
            <i class="fas fa-reply"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">تم الرد</span>
            <span class="stat-value">{{ counts.replied }}</span>
          </div>
        </div>
        <div class="stat-card closed">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">مغلقة</span>
            <span class="stat-value">{{ counts.closed }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-tabs">
        <button
          v-for="status in statuses"
          :key="status.value"
          :class="['filter-tab', { active: selectedStatus === status.value }]"
          @click="selectedStatus = status.value"
        >
          {{ status.label }}
        </button>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث في الرسائل..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Messages Table -->
    <div class="table-container">
      <table class="messages-table">
        <thead>
          <tr>
            <th>المرسل</th>
            <th>العنوان</th>
            <th>الحالة</th>
            <th>التاريخ</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="5">
              <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>جاري التحميل...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredMessages.length === 0" class="empty-row">
            <td colspan="5">
              <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>لا توجد رسائل</p>
              </div>
            </td>
          </tr>
          <tr
            v-else
            v-for="message in filteredMessages"
            :key="message.id"
            :class="['message-row', message.status]"
          >
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                  <span class="user-name">{{ message.user_name || message.name || 'مستخدم' }}</span>
                  <span class="user-email">{{ message.user_email || message.email || '-' }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="message-subject">
                {{ message.subject }}
              </div>
            </td>
            <td>
              <span :class="['status-badge', message.status]">
                {{ getStatusLabel(message.status) }}
              </span>
            </td>
            <td>
              <span class="message-date">{{ formatDate(message.created_at) }}</span>
            </td>
            <td>
              <div class="actions">
                <button @click="viewMessage(message)" class="action-btn view" title="عرض">
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="message.status !== 'replied'"
                  @click="replyToMessage(message)"
                  class="action-btn reply"
                  title="رد"
                >
                  <i class="fas fa-reply"></i>
                </button>
                <button @click="deleteMessage(message.id)" class="action-btn delete" title="حذف">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="pagination">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
      <span class="pagination-info">
        صفحة {{ currentPage }} من {{ pagination.pages }}
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === pagination.pages"
        class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <!-- View Message Modal -->
    <div v-if="selectedMessage" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>تفاصيل الرسالة</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="message-details">
            <div class="detail-row">
              <span class="detail-label">المرسل:</span>
              <span class="detail-value">{{ selectedMessage.user_name || selectedMessage.name || 'مستخدم' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">البريد الإلكتروني:</span>
              <span class="detail-value">{{ selectedMessage.user_email || selectedMessage.email || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">الهاتف:</span>
              <span class="detail-value">{{ selectedMessage.user_phone || selectedMessage.phone || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">العنوان:</span>
              <span class="detail-value">{{ selectedMessage.subject }}</span>
            </div>
            <div class="detail-row full">
              <span class="detail-label">الرسالة:</span>
              <p class="message-text">{{ selectedMessage.message }}</p>
            </div>
            <div v-if="selectedMessage.admin_reply" class="detail-row full">
              <span class="detail-label">الرد:</span>
              <p class="reply-text">{{ selectedMessage.admin_reply }}</p>
              <span class="reply-info">
                تم الرد بواسطة {{ selectedMessage.replied_by_name }} في {{ formatDate(selectedMessage.replied_at) }}
              </span>
            </div>
          </div>

          <!-- Reply Form -->
          <div v-if="!selectedMessage.admin_reply" class="reply-form">
            <h3>إرسال رد</h3>
            <textarea
              v-model="replyText"
              placeholder="اكتب ردك هنا..."
              class="reply-textarea"
              rows="5"
            ></textarea>
            <div class="reply-actions">
              <button @click="sendReply" :disabled="!replyText.trim() || sending" class="btn-primary">
                <i class="fas fa-paper-plane"></i>
                {{ sending ? 'جاري الإرسال...' : 'إرسال الرد' }}
              </button>
            </div>
          </div>

          <!-- Status Update -->
          <div class="status-update">
            <label>تحديث الحالة:</label>
            <select v-model="selectedMessage.status" @change="updateStatus" class="status-select">
              <option value="pending">قيد الانتظار</option>
              <option value="read">مقروءة</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلقة</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

const messages = ref<any[]>([])
const loading = ref(true)
const selectedMessage = ref<any>(null)
const replyText = ref('')
const sending = ref(false)
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const currentPage = ref(1)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 1,
})
const counts = ref({
  pending: 0,
  read: 0,
  replied: 0,
  closed: 0,
})

const statuses = [
  { value: null, label: 'الكل' },
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'read', label: 'مقروءة' },
  { value: 'replied', label: 'تم الرد' },
  { value: 'closed', label: 'مغلقة' },
]

const filteredMessages = computed(() => {
  let filtered = messages.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.subject?.toLowerCase().includes(query) ||
        m.message?.toLowerCase().includes(query) ||
        m.user_name?.toLowerCase().includes(query) ||
        m.name?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const fetchMessages = async () => {
  try {
    loading.value = true
    const params: any = {
      page: currentPage.value,
      limit: 20,
    }
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }
    const response = await dashboardStore.getContactMessages(params)
    messages.value = response.data
    pagination.value = response.pagination
    counts.value = response.counts
  } catch (error) {
    console.error('Error fetching messages:', error)
  } finally {
    loading.value = false
  }
}

const viewMessage = async (message: any) => {
  selectedMessage.value = message
  if (message.status === 'pending') {
    await updateMessageStatus(message.id, 'read')
    message.status = 'read'
  }
}

const replyToMessage = (message: any) => {
  selectedMessage.value = message
  replyText.value = ''
}

const sendReply = async () => {
  if (!replyText.value.trim() || !selectedMessage.value) return

  try {
    sending.value = true
    await dashboardStore.replyToContactMessage(selectedMessage.value.id, replyText.value)
    selectedMessage.value.admin_reply = replyText.value
    selectedMessage.value.status = 'replied'
    replyText.value = ''
    await fetchMessages()
  } catch (error) {
    console.error('Error sending reply:', error)
    alert('فشل إرسال الرد')
  } finally {
    sending.value = false
  }
}

const updateStatus = async () => {
  if (!selectedMessage.value) return
  await updateMessageStatus(selectedMessage.value.id, selectedMessage.value.status)
  await fetchMessages()
}

const updateMessageStatus = async (messageId: number, status: string) => {
  try {
    await dashboardStore.updateContactMessageStatus(messageId, status)
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

const deleteMessage = async (messageId: number) => {
  if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return

  try {
    await dashboardStore.deleteContactMessage(messageId)
    await fetchMessages()
  } catch (error) {
    console.error('Error deleting message:', error)
    alert('فشل حذف الرسالة')
  }
}

const closeModal = () => {
  selectedMessage.value = null
  replyText.value = ''
}

const getStatusLabel = (status: string) => {
  const statusMap: any = {
    pending: 'قيد الانتظار',
    read: 'مقروءة',
    replied: 'تم الرد',
    closed: 'مغلقة',
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

watch([currentPage, selectedStatus], () => {
  fetchMessages()
})

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.messages-view {
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header-content {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-card.pending .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.read .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-card.replied .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.closed .stat-icon {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
}

.filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.filter-tab:hover {
  border-color: #b8956a;
}

.filter-tab.active {
  background: #b8956a;
  color: white;
  border-color: #b8956a;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.search-box i {
  color: #9ca3af;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  width: 250px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.messages-table {
  width: 100%;
  border-collapse: collapse;
}

.messages-table thead {
  background: #f9fafb;
}

.messages-table th {
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.messages-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b8956a, #a8855a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1a202c;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
}

.message-subject {
  font-weight: 500;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.read {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.replied {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.closed {
  background: #e5e7eb;
  color: #374151;
}

.message-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn.view {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.view:hover {
  background: #3b82f6;
  color: white;
}

.action-btn.reply {
  background: #d1fae5;
  color: #065f46;
}

.action-btn.reply:hover {
  background: #10b981;
  color: white;
}

.action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

.loading-row,
.empty-row {
  text-align: center;
}

.loading-spinner,
.empty-state {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
}

.loading-spinner i {
  font-size: 2rem;
}

.empty-state i {
  font-size: 3rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #b8956a;
  color: #b8956a;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #6b7280;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 1.5rem;
}

.message-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
}

.detail-row.full {
  flex-direction: column;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.detail-value {
  color: #6b7280;
}

.message-text,
.reply-text {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
}

.reply-text {
  background: #d1fae5;
}

.reply-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.reply-form {
  margin-bottom: 2rem;
}

.reply-form h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.reply-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.reply-textarea:focus {
  outline: none;
  border-color: #b8956a;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #b8956a, #a8855a);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 149, 106, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-update {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f3f4f6;
}

.status-update label {
  font-weight: 600;
  color: #374151;
}

.status-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #b8956a;
}
</style>