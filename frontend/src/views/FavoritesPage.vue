<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
      <div class="flex justify-center mb-4">
        <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
      <h2 class="text-4xl font-bold text-white mb-3">我的收藏</h2>
      <p class="text-xl text-white/90">{{ favorites.length }} 个精选资源</p>
    </div>

    <!-- License Risk Analysis Panel -->
    <div v-if="favorites.length > 0 && analysis.warnings.length > 0" class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center space-x-3">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-xl font-bold text-white">许可证风险提醒</h3>
          <p class="text-white/90 text-sm">检测到 {{ analysis.warnings.length }} 项需要注意的许可证相关问题</p>
        </div>
      </div>

      <div class="px-6 py-5 space-y-4">
        <div
          v-for="(warning, idx) in analysis.warnings"
          :key="idx"
          class="rounded-xl p-5 border-l-4 transition-colors"
          :class="{
            'bg-red-50 border-red-500': warning.level === 'high',
            'bg-yellow-50 border-yellow-500': warning.level === 'medium',
            'bg-orange-50 border-orange-400': warning.level === 'warning',
            'bg-blue-50 border-blue-400': warning.level === 'low'
          }"
        >
          <div class="flex items-start justify-between gap-4 mb-2">
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                :class="{
                  'bg-red-100 text-red-700': warning.level === 'high',
                  'bg-yellow-100 text-yellow-700': warning.level === 'medium',
                  'bg-orange-100 text-orange-700': warning.level === 'warning',
                  'bg-blue-100 text-blue-700': warning.level === 'low'
                }"
              >
                {{ warning.level === 'high' ? '高风险' : warning.level === 'medium' ? '中风险' : warning.level === 'warning' ? '警告' : '提示' }}
              </span>
              <h4 class="font-semibold text-gray-900">{{ warning.title }}</h4>
            </div>
          </div>

          <p class="text-gray-700 leading-relaxed mb-3">{{ warning.message }}</p>

          <div v-if="warning.pair" class="flex flex-wrap gap-2 mb-2">
            <div
              v-for="p in warning.pair"
              :key="p.id"
              class="bg-white rounded-lg px-3 py-2 border shadow-sm text-sm"
            >
              <span class="font-medium text-gray-800">{{ p.name }}</span>
              <span class="mx-1 text-gray-400">·</span>
              <a
                v-if="p.licenseUrl || p.meta?.url"
                :href="p.licenseUrl || p.meta?.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-purple-600 hover:underline font-semibold"
              >
                {{ p.licenseNormalized }} ↗
              </a>
              <span v-else class="text-red-600 font-semibold">无许可证</span>
            </div>
          </div>

          <div v-if="warning.relatedItems && warning.relatedItems.length" class="flex flex-wrap gap-2 mb-2">
            <span class="text-sm text-gray-600 mr-1 self-center">相关资源：</span>
            <div
              v-for="r in warning.relatedItems"
              :key="r.id"
              class="bg-white rounded-lg px-3 py-2 border shadow-sm text-sm"
            >
              <span class="font-medium text-gray-800">{{ r.name }}</span>
              <span class="mx-1 text-gray-400">·</span>
              <a
                v-if="r.licenseUrl || r.meta?.url"
                :href="r.licenseUrl || r.meta?.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-purple-600 hover:underline font-semibold"
              >
                {{ r.licenseNormalized }} ↗
              </a>
            </div>
          </div>

          <div v-if="warning.targetId" class="text-sm">
            <span class="text-gray-600 mr-1">涉及资源：</span>
            <span class="font-medium text-gray-800">{{ warning.targetName }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
          ⚠️ 以上仅为基于开源许可证常见规则的风险提示，不构成法律意见。项目实际合规情况请结合具体使用方式并咨询专业法务。
        </p>
      </div>
    </div>

    <!-- License Stats Summary -->
    <div v-if="favorites.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 shadow-lg">
        <div class="text-sm text-gray-500 mb-1">收藏总数</div>
        <div class="text-3xl font-bold text-gray-900">{{ analysis.stats.total }}</div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-lg">
        <div class="text-sm text-gray-500 mb-1">低风险许可</div>
        <div class="text-3xl font-bold text-green-600">{{ analysis.stats.byRisk.low }}</div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-lg">
        <div class="text-sm text-gray-500 mb-1">中风险许可</div>
        <div class="text-3xl font-bold text-yellow-600">{{ analysis.stats.byRisk.medium }}</div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-lg">
        <div class="text-sm text-gray-500 mb-1">高风险/未标注</div>
        <div class="text-3xl font-bold text-red-600">{{ analysis.stats.byRisk.high + analysis.stats.noLicense }}</div>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div class="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Favorites List -->
    <div v-else-if="favorites.length > 0" class="space-y-4">
      <transition-group name="list" tag="div">
        <div
          v-for="item in favorites"
          :key="item.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          :class="{ 'ring-4 ring-red-400 ring-opacity-60': !item.license }"
        >
          <div class="p-6">
            <div v-if="!item.license" class="mb-4 bg-red-50 border border-red-300 rounded-lg px-4 py-3 flex items-start space-x-3">
              <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <div class="font-semibold text-red-800">⚠️ 未标注许可证</div>
                <div class="text-sm text-red-700">该资源没有明确的授权说明，使用前请自行确认其许可条款，避免版权风险。</div>
              </div>
            </div>

            <div class="flex justify-between items-start gap-4 mb-4">
              <div class="flex-1">
                <h4 class="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {{ item.name }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-if="item.category" class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap">
                    {{ item.category }}
                  </span>
                  <span v-if="item.size" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{{ item.size }}</span>
                  </span>
                  <a
                    v-if="item.license"
                    :href="item.license_url || getLicenseMeta(item.license)?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-opacity hover:opacity-80"
                    :class="getLicenseBadgeClass(item.license)"
                    :title="getLicenseMeta(item.license)?.description || '查看授权说明'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{{ item.license }}</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <span
                    v-else
                    class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1"
                    :class="getLicenseBadgeClass(null)"
                    title="该资源未标注许可证"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>无许可证</span>
                  </span>
                </div>
                <div v-if="item.license && getLicenseMeta(item.license)?.description" class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  {{ getLicenseMeta(item.license).description }}
                </div>
              </div>
              <button
                @click="confirmDelete(item.id)"
                class="flex-shrink-0 p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-12"
                title="删除收藏"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
              <div class="flex items-center space-x-2 text-green-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <div class="text-xs text-gray-600">做种</div>
                  <div class="font-bold text-lg">{{ item.seeders || 0 }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-yellow-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div>
                  <div class="text-xs text-gray-600">下载</div>
                  <div class="font-bold text-lg">{{ item.leechers || 0 }}</div>
                </div>
              </div>
            </div>

            <button
              @click="copyMagnet(item.magnet)"
              class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>复制磁力链接</span>
            </button>

            <div class="flex items-center space-x-2 text-gray-500 text-sm pt-4 border-t border-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatDate(item.created_at) }}</span>
              <span v-if="item.source" class="ml-auto text-gray-500">来源：{{ item.source }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-xl text-white/80 mb-6">还没有收藏任何资源</p>
      <button
        @click="$router.push('/')"
        class="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>去搜索</span>
      </button>
    </div>

    <!-- Toast Notification -->
    <transition name="slide-up">
      <div
        v-if="toast.show"
        class="fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-2xl text-white font-medium z-50"
        :class="toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- Confirm Dialog -->
    <transition name="fade">
      <div v-if="showConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
          <p class="text-gray-600 mb-6">确定要删除这个收藏吗？</p>
          <div class="flex gap-3">
            <button
              @click="showConfirm = false"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              取消
            </button>
            <button
              @click="deleteFavorite"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { analyzeFavorites, normalizeLicense, getLicenseMeta } from '../utils/licenseAnalyzer'

const favorites = ref([])
const loading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
const showConfirm = ref(false)
const deleteId = ref(null)

const analysis = computed(() => analyzeFavorites(favorites.value))

const getLicenseBadgeClass = (license) => {
  const normalized = normalizeLicense(license)
  if (!normalized) {
    return 'bg-red-100 text-red-700 border border-red-300'
  }
  const meta = getLicenseMeta(normalized)
  switch (meta?.riskLevel) {
    case 'high':
      return 'bg-red-50 text-red-700 border border-red-300'
    case 'medium':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-400'
    default:
      return 'bg-green-50 text-green-700 border border-green-300'
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const loadFavorites = async () => {
  loading.value = true
  try {
    const response = await api.getFavorites()
    favorites.value = response.data || []
  } catch (error) {
    showToast('加载收藏列表失败', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (id) => {
  deleteId.value = id
  showConfirm.value = true
}

const deleteFavorite = async () => {
  try {
    await api.deleteFavorite(deleteId.value)
    favorites.value = favorites.value.filter(item => item.id !== deleteId.value)
    showConfirm.value = false
    showToast('删除成功', 'success')
  } catch (error) {
    showToast('删除失败', 'error')
  }
}

const copyMagnet = (magnet) => {
  navigator.clipboard.writeText(magnet)
  showToast('磁力链接已复制到剪贴板', 'success')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.list-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
