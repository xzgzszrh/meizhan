<script setup>
import { defineAsyncComponent, onUnmounted, ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar/index.js'
import { Camera } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog/index.js'
import { eventBus } from '@/lib/eventBus.js'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer/index.js'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

const props = defineProps({
  avatarUrl: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
})

const AvatarDialog = defineAsyncComponent(() => import('@/components/Base/Avatar/AvatarDialog.vue'))

const isOpen = ref(false)

const handleEvent = (data) => {
  isOpen.value = data
}

const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)
onUnmounted(cleanup)

const [UseTriggerTemplate, TriggerTemplate] = createReusableTemplate()
const [UseContentTemplate, ContentTemplate] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseTriggerTemplate>
    <button
      type="button"
      class="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="更换头像"
    >
      <Avatar
        class="h-16 w-16 border border-border/70 bg-card text-xl shadow-[0_10px_30px_-18px_rgba(15,39,64,0.45)] transition-transform duration-200 group-hover:scale-[1.03] md:h-20 md:w-20 md:text-2xl"
      >
        <AvatarImage :src="avatarUrl" alt="用户头像" />
        <AvatarFallback>{{ userName }}</AvatarFallback>
      </Avatar>
      <span
        class="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 text-background opacity-0 transition-all duration-200 group-hover:bg-foreground/55 group-hover:opacity-100"
      >
        <Camera :size="18" />
      </span>
    </button>
  </UseTriggerTemplate>

  <UseContentTemplate>
    <AvatarDialog />
  </UseContentTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <TriggerTemplate />
    </DialogTrigger>
    <DialogContent class="pb-16">
      <ContentTemplate />
    </DialogContent>
  </Dialog>
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <TriggerTemplate />
    </DrawerTrigger>
    <DrawerContent class="px-5">
      <ContentTemplate />
    </DrawerContent>
  </Drawer>
</template>
