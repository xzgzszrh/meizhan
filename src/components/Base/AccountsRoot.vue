<script setup>
import { useLogto } from '@logto/vue'
import { onMounted, onUnmounted, provide, ref } from 'vue'
import SideBar from '@/components/Base/SideBar.vue'
import NavBar from '@/components/Base/NavBar.vue'
import { Button } from '@/components/ui/button/index.js'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { AlertOctagon, RefreshCw } from 'lucide-vue-next'
import { eventBus } from '@/lib/eventBus.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { RouterView } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { API } from '@/lib/apiRouteMap.js'

const { fetchUserInfo, getAccessToken } = useLogto()
const userInfo = ref(null)
const isLoading = ref(true)
const isSubPageLoading = ref(false)
const fetchFailure = ref(false)
const mfaOptions = ref({})

const support = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`
const webBuild = `prod/${import.meta.env.VITE_COMMIT_HASH.length > 7 ? import.meta.env.VITE_COMMIT_HASH.substring(0, 7) : import.meta.env.VITE_COMMIT_HASH}`

async function loadData() {
  fetchFailure.value = false
  isLoading.value = true
  try {
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
    const logtoRepsonse = await fetchUserInfo()
    const response = await axios.get(API.ME.INFO, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    userInfo.value = {
      ...response.data,
      ...logtoRepsonse,
      organizations: logtoRepsonse?.organizations ?? response.data?.organizations ?? []
    }
  } catch (error) {
    console.log('error loading user information', error)
    toast.error('Error grabbing User Information:', {
      description: 'Service Unavailable. Try again later'
    })
    fetchFailure.value = true
  }
  try {
    const response = await axios.get(API.MFA.METHODS, {
      headers: {
        Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`,
        'Content-Type': 'application/json'
      }
    })
    if (response.data[0]?.type === 'Totp') {
      mfaOptions.value.totp = response.data[0]
    }
    if (response.data[1]?.type === 'BackupCode') {
      mfaOptions.value.backup = response.data[1]
    }
  } catch (error) {
    toast.error('Error grabbing MFA Information:', {
      description: 'Some account actions will be unavailable'
    })
    fetchFailure.value = true
  } finally {
    isLoading.value = false
  }
}

const handleRefresh = (data) => {
  if (data) {
    if (!isDesktop.value) {
      window.location.reload()
    }
    loadData()
  }
}

const handleLoading = (data) => {
  isSubPageLoading.value = data
}

onMounted(loadData)

provide('userData', userInfo)
provide('mfaMethods', mfaOptions)

const cleanup = eventBus.on('refreshUserData', handleRefresh)
eventBus.on('AccountLoading', handleLoading)
onUnmounted(cleanup)

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <div class="page-shell account-shell">
    <div class="flex h-full min-h-0 w-full flex-col">
      <NavBar />
      <div
        v-if="!fetchFailure && !isLoading"
        class="mt-2 grid min-h-0 flex-1 gap-2 overflow-hidden lg:grid-cols-[clamp(248px,20vw,320px)_minmax(0,1fr)] lg:gap-2"
      >
        <SideBar v-if="isDesktop" />
        <main
          class="min-h-0 min-w-0 overflow-y-auto rounded-[var(--radius-surface)] border border-border/80 bg-background/55 pb-3 md:pb-4 lg:pb-5"
        >
          <RouterView v-if="!isSubPageLoading" />
          <div v-if="isSubPageLoading" class="space-y-4">
            <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div class="h-full w-1/3 animate-pulse rounded-full bg-primary/70"></div>
            </div>
            <div class="space-y-2">
              <Skeleton class="h-8 w-[220px]" />
              <Skeleton class="h-4 w-full max-w-[620px]" />
              <Skeleton class="h-4 w-3/4 max-w-[420px]" />
            </div>
            <div class="grid gap-4 md:grid-cols-2 mt-8">
              <Skeleton class="h-[160px] w-full rounded-[var(--radius-surface)]" />
              <Skeleton class="h-[160px] w-full rounded-[var(--radius-surface)]" />
            </div>
            <div class="grid gap-4 md:grid-cols-2 mt-4">
              <Skeleton class="h-[160px] w-full rounded-[var(--radius-surface)]" />
              <Skeleton class="h-[160px] w-full rounded-[var(--radius-surface)]" />
            </div>
          </div>
        </main>
      </div>
      <div
        v-else-if="fetchFailure && !isLoading"
        class="material-surface mx-auto mt-8 flex w-full max-w-xl flex-col items-center justify-center gap-y-4 p-6 text-center md:p-10"
      >
        <AlertOctagon :size="64" class="text-red-500" />
        <div class="space-y-2">
          <p class="text-lg font-semibold text-red-600 dark:text-red-400">账户信息加载失败</p>
          <p class="text-sm text-muted-foreground">
            当前服务暂时不可用，请稍后重试，或检查 Logto 与本地接口是否正常。
          </p>
        </div>
        <Button @click="loadData" variant="outline" class="h-10 rounded-lg px-5">
          <RefreshCw class="mr-2 h-4 w-4" />
          重新加载
        </Button>
      </div>
      <div
        v-else-if="isLoading"
        class="material-surface mx-auto mt-8 w-full max-w-md overflow-hidden"
      >
        <div class="h-1 w-full bg-muted">
          <div class="h-full w-1/2 animate-pulse bg-primary/70"></div>
        </div>
        <div class="flex items-center gap-3 px-6 py-6 text-sm text-muted-foreground">
          正在加载账户信息...
        </div>
      </div>
    </div>
  </div>
</template>
