<script setup>
import { onUnmounted, ref } from 'vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible/index.js'
import { Card } from '@/components/ui/card/index.js'
import { ChevronDown, Link, Link2, Link2Off, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import { eventBus } from '@/lib/eventBus.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { useLogto } from '@logto/vue'
import { useMediaQuery } from '@vueuse/core'
import { API } from '@/lib/apiRouteMap.js'

const { getAccessToken } = useLogto()
const isLoading = ref(false)

const props = defineProps({
  disabled: Boolean,
  icon: Object,
  target: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  linked: Boolean,
  description: {
    type: String,
    default: ''
  }
})

const isOpen = ref(false)
function closeOther() {
  eventBus.emit('flipCollapsibleValues', props.target)
}
const handleStateChange = (data) => {
  if (data !== props.target) {
    isOpen.value ? (isOpen.value = false) : (isOpen.value = false)
  }
}
const cleanup = eventBus.on('flipCollapsibleValues', handleStateChange)

async function removeConnector() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      API.CONNECTORS.REMOVE(props.target),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      toast.success(`已解绑 ${props.service}`, {
        description: '如有需要，也可以前往对应平台撤销该应用授权。'
      })
    }
  } catch (error) {
    toast.error(`解绑 ${props.service} 失败`, { description: '服务暂时不可用，请稍后再试。' })
  } finally {
    isLoading.value = false
    isOpen.value = false
    eventBus.emit('refreshUserData', true)
  }
}

const disableLinkButton = ref(false)

let windowChecker = null
let authWindow = null

const beginAuthorizationFlow = () => {
  if (props.disabled || disableLinkButton.value) {
    return
  }

  disableLinkButton.value = true
  const url = `/oauth/connectors/new/${props.target}`
  const width = 400
  const height = 700
  const left = screen.width / 2 - width / 2
  const top = screen.height / 2 - height / 2
  authWindow = window.open(
    url,
    'AuthorizationWindow',
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  )
  windowChecker = setInterval(() => {
    if (authWindow && authWindow.closed) {
      eventBus.emit('refreshUserData', true)
      disableLinkButton.value = false
      clearInterval(windowChecker)
    }
  }, 500)
}

onUnmounted(() => {
  cleanup()
  if (windowChecker) {
    clearInterval(windowChecker)
  }
})

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <Card
    class="mb-4 w-full border border-border/70 bg-background/70 p-4 transition-all duration-200"
  >
    <Collapsible v-model:open="isOpen" @update:open="closeOther">
      <CollapsibleTrigger class="flex w-full items-center justify-between gap-4 text-left">
        <div class="flex min-w-0 items-center gap-4">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/80 bg-secondary text-foreground"
          >
            <component :is="icon" v-if="icon" :size="18" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-base font-semibold">{{ service }}</p>
            <p class="mt-1 truncate text-xs text-muted-foreground">{{ target }}</p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <div class="flex items-center gap-2">
            <p
              :class="linked ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'"
              class="text-sm"
            >
              {{ linked ? '已绑定' : '未绑定' }}
            </p>
            <Link2Off v-if="!linked" :size="16" class="text-muted-foreground" />
            <Link2 v-else :size="16" class="text-green-600 dark:text-green-400" />
          </div>
          <ChevronDown :class="{ 'rotate-180': isOpen }" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="flex flex-col gap-4 pt-4" v-if="!linked">
        <div class="min-w-0 flex-1">
          <p class="text-sm leading-6 text-muted-foreground">
            {{ description || `点击下方按钮后，将跳转到 ${service} 完成授权，并绑定到当前账号。` }}
          </p>
        </div>
        <div class="flex w-full flex-col items-stretch gap-y-2">
          <Button
            :disabled="disabled || disableLinkButton"
            class="w-full border border-border/80"
            @click="beginAuthorizationFlow"
          >
            <Link class="mr-1 h-4 w-4" />
            <strong v-if="!disableLinkButton">
              {{ disabled ? '暂不可用' : `绑定 ${service}` }}
            </strong>
            <p v-else class="flex items-center">
              <Loader2 class="mr-1 h-4 w-4 animate-spin" />
              等待授权...
            </p>
          </Button>
        </div>
      </CollapsibleContent>
      <CollapsibleContent v-else class="flex flex-col gap-4 pt-4">
        <div class="min-w-0 flex-1">
          <p class="text-sm leading-6 text-muted-foreground">
            当前账号已绑定
            {{ service }}。如果解绑，后续将无法再使用该第三方身份快速登录，除非重新授权。
          </p>
        </div>
        <div class="flex w-full flex-col items-stretch gap-y-2">
          <Button
            variant="destructive"
            class="w-full"
            :disabled="isLoading"
            @click="removeConnector"
          >
            <Loader2 v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
            解绑{{ isDesktop ? service : '' }}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease-in-out;
}
</style>
