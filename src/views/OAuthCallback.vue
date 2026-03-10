<script setup>
import { useHandleSignInCallback } from '@logto/vue'
import { useRouter } from 'vue-router'
import { UserCheck } from 'lucide-vue-next'

const router = useRouter()

const { isLoading } = useHandleSignInCallback(() => {
  router.push({ path: '/account/aboutme' })
})
</script>

<template>
  <div class="page-shell flex min-h-screen items-center justify-center">
    <div
      class="glass-panel flex max-w-md flex-col items-center rounded-[var(--radius-shell)] px-10 py-12 text-center shadow-xl"
    >
      <div class="rounded-full bg-emerald-500/10 p-4 text-emerald-500">
        <UserCheck :size="48" color="currentColor" />
      </div>
      <p class="mt-5 text-2xl font-bold">登录成功</p>
      <p class="mt-2 text-sm text-muted-foreground" v-if="isLoading">正在跳转到账号中心...</p>
    </div>
  </div>
</template>

<style scoped></style>
