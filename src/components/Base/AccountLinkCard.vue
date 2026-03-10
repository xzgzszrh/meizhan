<script setup>
import { computed } from 'vue'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index.js'

const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, required: false, default: '' },
  icon: { required: true },
  path: { type: String, required: true }
})

const baseUrl =
  import.meta.env.VITE_LOGTO_ACCOUNT_URL || import.meta.env.VITE_LOGTO_ENDPOINT || ''

const fullUrl = computed(() => {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = props.path.startsWith('/') ? props.path : `/${props.path}`
  return `${normalizedBase}${normalizedPath}`
})
</script>

<template>
  <a :href="fullUrl" class="block h-full">
    <Card
      class="section-card h-full min-h-32 w-full overflow-hidden transition-all duration-150 hover:cursor-pointer hover:border-primary/35 hover:bg-secondary/35"
    >
      <CardHeader class="relative space-y-4 p-4 md:p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="material-chip mb-2">账户功能</div>
            <CardTitle class="flex justify-between text-base font-semibold md:text-lg">
              {{ title }}
            </CardTitle>
          </div>
          <div class="rounded-lg border border-border/80 bg-secondary p-3 text-secondary-foreground">
            <component :is="icon" v-if="icon" />
          </div>
        </div>
        <CardDescription class="text-sm leading-6 text-muted-foreground">
          {{ desc }}
        </CardDescription>
      </CardHeader>
    </Card>
  </a>
</template>
