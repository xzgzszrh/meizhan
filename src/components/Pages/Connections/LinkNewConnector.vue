<script setup>
import axios from 'redaxios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLogto } from '@logto/vue'
import { CircleCheckBig, LoaderCircle, OctagonAlert } from 'lucide-vue-next'
import { API } from '@/lib/apiRouteMap.js'

const route = useRoute()
const { getAccessToken } = useLogto()
const isLoading = ref(true)
const loaderText = ref('Loading...')
const hasError = ref(false)
const isSuccess = ref(false)

const accessTokenHeaders = async () => ({
  Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`,
  'Content-Type': 'application/json'
})

const redirectToBuiltUri = async () => {
  loaderText.value = '正在获取连接器信息...'
  try {
    const response = await axios.post(
      API.CONNECTORS.BUILD_URI(route.params.connector),
      {
        redirectUri: `${import.meta.env.VITE_ROOT}/callback/connectors/${route.params.connector}`
      },
      { headers: await accessTokenHeaders() }
    )
    if (response.status === 200) {
      loaderText.value = `正在跳转到 ${route.params.connector} 授权页面...`
      await new Promise((resolve) => setTimeout(resolve, 2000))
      window.location.replace(response.data.redirectTo)
    }
  } catch (error) {
    console.log(error)
    loaderText.value = '获取授权地址失败，请检查 Logto 中是否已正确配置该连接器。'
    hasError.value = true
    isLoading.value = false
  }
}

const linkConnectorToAccount = async () => {
  loaderText.value = '正在绑定第三方账号...'
  try {
    const response = await axios.post(
      API.CONNECTORS.LINK(route.params.connector),
      {
        connectorData: {
          code: route.query.code,
          state: route.query.state,
          redirectUri: `${import.meta.env.VITE_ROOT}/callback/connectors/${route.params.connector}`,
          key: route.query.key ?? null
        }
      },
      { headers: await accessTokenHeaders() }
    )
    if (response.status === 200) {
      isSuccess.value = true
      isLoading.value = false
      loaderText.value = '绑定成功，窗口即将关闭...'
      setTimeout(() => {
        window.close()
      }, 1200)
    }
  } catch (error) {
    console.log(error)
    loaderText.value = '绑定失败，请确认第三方授权已完成，且 Logto 连接器支持当前绑定方式。'
    hasError.value = true
    isLoading.value = false
  }
}

const connectorFlowControl = async () => {
  hasError.value = false
  isSuccess.value = false
  isLoading.value = true

  if (route.params.action === 'new') {
    await redirectToBuiltUri()
  } else {
    await linkConnectorToAccount()
  }
}

onMounted(connectorFlowControl)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-6">
    <div class="flex max-w-md flex-col items-center justify-center text-center">
      <LoaderCircle v-if="isLoading" :size="96" class="animate-spin" />
      <CircleCheckBig v-else-if="isSuccess" :size="96" class="text-green-600 dark:text-green-400" />
      <OctagonAlert v-else-if="hasError" :size="96" class="text-red-600 dark:text-red-400" />

      <p class="mt-6 text-xl font-semibold">{{ loaderText }}</p>
      <p v-if="hasError" class="mt-3 text-sm leading-6 text-muted-foreground">
        你可以关闭此窗口后返回用户中心，检查对应连接器的 Client ID、Client Secret 与回调地址配置。
      </p>
    </div>
  </div>
</template>

<style scoped></style>
