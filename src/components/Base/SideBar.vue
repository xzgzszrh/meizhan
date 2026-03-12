<script setup>
import { computed, inject, ref } from 'vue'

import Button from '../ui/button/Button.vue'
import {
  AlertTriangle,
  BadgeCheck,
  Cable,
  Compass,
  CircleUserRound,
  Code,
  Cog,
  Cookie,
  ShieldCheck
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar/index.js'
import { useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'

const sheetOpen = defineModel()

const userData = inject('userData')
const route = useRoute()

const isLoading = ref('')
const sidebarNavItems = ref([
  {
    title: '个人资料',
    desc: '姓名、生日、地区与语言',
    icon: CircleUserRound,
    href: '/account/aboutme'
  },
  {
    title: '莓站资源',
    desc: '群友资源入口与订阅推荐',
    icon: Compass,
    href: '/account/resources'
  },
  {
    title: '登录与安全',
    desc: '邮箱、手机号、密码与 MFA',
    icon: Cog,
    href: '/account/security'
  },
  {
    title: '隐私设置',
    desc: '控制共享、分析与展示范围',
    icon: Cookie,
    href: '/account/privacy'
  },
  {
    title: '账号连接',
    desc: '统一管理第三方绑定',
    icon: Cable,
    href: '/account/connections'
  },
  {
    title: '我的认证',
    desc: '查看我的认证',
    icon: BadgeCheck,
    href: '/account/verifications'
  },
  {
    title: '危险操作',
    desc: '暂停或注销账户',
    icon: AlertTriangle,
    href: '/account/dangerzone'
  },
  {
    title: '开发者选项',
    desc: '启用开发者身份能力',
    icon: Code,
    href: '/account/developer'
  }
])

const handleNav = (navigate, page, key) => {
  if (page !== key) {
    isLoading.value = page
  }
  if (sheetOpen.value) {
    sheetOpen.value = false
  }
  navigate()
}
const isDesktop = useMediaQuery('(min-width: 1023px)')
const displayName = computed(
  () => userData?.value?.name || userData?.value?.username || '未命名用户'
)
const usernameText = computed(() =>
  userData?.value?.username ? `@${userData.value.username}` : '未设置用户名'
)
</script>

<template>
  <aside
    class="material-surface tonal flex h-full min-h-0 w-full flex-col overflow-hidden border-border/90 p-2.5 md:p-3"
  >
    <div class="rounded-[var(--radius-surface)] border border-border/90 bg-background/95 p-4">
      <div class="flex items-center gap-3">
        <div class="relative shrink-0">
          <Avatar
            class="h-[92px] w-[92px] border border-border/80 bg-card text-3xl shadow-[0_18px_40px_-24px_rgba(15,39,64,0.5)]"
          >
            <AvatarImage :src="userData.avatar" alt="账户头像" />
            <AvatarFallback>{{ displayName }}</AvatarFallback>
          </Avatar>
          <span
            class="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
          >
            <ShieldCheck :size="8" class="text-white" />
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="truncate text-base font-semibold leading-6 text-foreground">
            {{ displayName }}
          </div>
          <div class="mt-1 truncate text-sm text-muted-foreground">
            {{ usernameText }}
          </div>
        </div>
      </div>
    </div>

    <nav class="mt-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
      <router-link
        v-for="item in sidebarNavItems"
        :key="item.title"
        :to="item.href"
        custom
        v-slot="{ navigate }"
      >
        <Button
          as="button"
          variant="ghost"
          :size="isDesktop ? 'default' : 'default'"
          :class="
            route.path === item.href
              ? 'rounded-[var(--radius-control)] bg-primary/[0.1] text-foreground shadow-none'
              : 'text-foreground/90 hover:bg-background/80'
          "
          class="h-auto w-full justify-start whitespace-normal rounded-[var(--radius-control)] px-3 py-3.5 text-left"
          @click="handleNav(navigate, item.href, $route.path)"
        >
          <div class="flex w-full items-start gap-3">
            <div
              class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/80 text-foreground/80"
            >
              <component :is="item.icon" v-if="item.icon" :size="17" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-base font-semibold leading-6">{{ item.title }}</div>
              <div class="mt-1 text-sm leading-6 text-muted-foreground">{{ item.desc }}</div>
            </div>
          </div>
        </Button>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped></style>
