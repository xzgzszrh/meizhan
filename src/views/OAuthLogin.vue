<script setup>
import { onMounted } from 'vue'
import { useLogto } from '@logto/vue'

const { signIn } = useLogto()

onMounted(() => signIn(`${import.meta.env.VITE_ROOT}/oauth/callback`))
</script>

<template>
  <div class="page-shell flex min-h-screen items-center justify-center">
    <div class="glass-panel rounded-[var(--radius-shell)] px-10 py-12 text-center shadow-xl">
      <p class="text-sm text-muted-foreground">正在跳转至身份验证中心...</p>
      <h1 class="mt-3 text-2xl font-semibold">请稍候，马上为你完成登录</h1>
    </div>
  </div>
</template>
