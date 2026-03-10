<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useLogto } from '@logto/vue'
import { Button } from '@/components/ui/button/index.js'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DoorOpen, Menu, Moon, Sun } from 'lucide-vue-next'
import { useDark, useMediaQuery, useScroll } from '@vueuse/core'
import SideBar from '@/components/Base/SideBar.vue'
import logoImage from '../../../Logo.png'

const { signOut } = useLogto()
const onClickSignOut = () => signOut(import.meta.env.VITE_ROOT)

const isDark = useDark({
  selector: 'html'
})
function changeTheme() {
  isDark.value = !isDark.value
}
const isDesktop = useMediaQuery('(min-width: 1023px)')
const isPhone = useMediaQuery('(max-width: 588px)')

const isSheetOpen = ref(false)

const showElevation = ref(false)
const { y } = useScroll(window)
let stopScroll = null

const updateElevation = () => {
  showElevation.value = y.value > 6
}

onMounted(() => {
  updateElevation()
  stopScroll = y.onChange(updateElevation)
})

onUnmounted(() => {
  if (stopScroll) {
    stopScroll()
  }
  showElevation.value = false
})
</script>

<template>
  <header class="w-full">
    <div
      :class="[
        'material-surface flex min-h-[64px] items-center border-border/90 bg-card/96 px-3 py-3 md:min-h-[72px] md:px-4',
        showElevation ? 'md-elevation-2' : 'md-elevation-1'
      ]"
    >
      <div class="flex w-full items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <Sheet v-if="!isDesktop" v-model:open="isSheetOpen">
            <SheetTrigger as-child>
              <Button
                variant="secondary"
                size="icon"
                class="h-10 w-10 rounded-lg border border-border/90"
                aria-label="打开导航菜单"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              class="inset-0 h-[100dvh] w-[100dvw] max-w-none border-none bg-background p-0 shadow-none sm:max-w-none"
            >
              <div class="flex min-h-[100dvh] flex-col bg-background">
                <div
                  class="flex min-h-[72px] items-center border-b border-border/80 bg-card px-4 pr-14"
                >
                  <div class="min-w-0">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Account
                    </div>
                    <div class="text-lg font-semibold tracking-tight text-foreground">账户导航</div>
                  </div>
                </div>
                <div class="min-h-0 flex-1 overflow-hidden">
                  <SideBar
                    v-model="isSheetOpen"
                    class="h-full rounded-[var(--radius-surface)] border-0 p-0 shadow-none"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div class="flex min-w-0 items-center gap-3">
            <img :src="logoImage" alt="莓站 Logo" class="h-8 w-auto max-w-[140px] object-contain" />
            <div class="min-w-0 hidden sm:block">
              <h1
                class="truncate text-xl font-semibold tracking-[0.04em] text-foreground md:text-2xl"
              >
                用户中心
              </h1>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button
            v-if="!isPhone"
            class="h-10 w-10 rounded-lg border border-border/90"
            variant="secondary"
            size="icon"
            @click="changeTheme"
          >
            <Sun v-if="isDark" class="text-foreground" />
            <Moon v-else />
          </Button>
          <Button
            v-if="isPhone"
            @click="changeTheme"
            variant="secondary"
            size="icon"
            class="h-10 w-10 rounded-lg border border-border/90"
            aria-label="切换主题"
          >
            <Sun v-if="isDark" class="text-foreground" />
            <Moon v-else />
          </Button>
          <Button
            @click="onClickSignOut"
            variant="ghost"
            class="h-10 rounded-lg border border-border/90 bg-background px-3 text-sm hover:border-primary/25 hover:bg-secondary md:px-4"
          >
            <DoorOpen :stroke-wdth="2.25" class="mr-0 md:mr-1.5" />
            <span class="hidden md:inline">退出登录</span>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>
