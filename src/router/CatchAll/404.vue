<script setup>
import { Button } from '@/components/ui/button/index.js'
</script>

<template>
  <div class="page-shell flex min-h-screen items-center justify-center">
    <div
      class="glass-panel flex max-w-xl flex-col items-center rounded-[var(--radius-shell)] px-8 py-10 text-center"
    >
      <img
        class="logo max-h-[280px] object-contain"
        src="https://cdn.vstatic.net/content/KQgCslvqJtiMCkBKQmZp/t2v.ch/img/404_minified.webp"
        alt="logo"
      />
      <p class="mt-4 text-2xl font-semibold">页面走丢了</p>
      <p class="mt-2 text-sm text-muted-foreground">你访问的地址不存在，或者当前页面已经被移动。</p>
      <Button variant="link" @click="() => $router.push('/account/aboutme')"> 返回账号首页 </Button>
    </div>
  </div>
</template>
