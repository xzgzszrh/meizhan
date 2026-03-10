<script setup>
defineProps({
  icon: { required: false },
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  badge: { type: String, required: false, default: '' },
  danger: { type: Boolean, default: false }
})
</script>

<template>
  <section class="space-y-0">
    <div class="page-hero material-surface tonal relative overflow-hidden">
      <div
        class="relative flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
      >
        <div class="flex min-w-0 items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/20 bg-primary/10 text-primary"
            :class="
              danger
                ? 'border-red-200 bg-red-100 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300'
                : 'border-primary/20 bg-primary/10 text-primary'
            "
          >
            <component :is="icon" v-if="icon" :size="22" />
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="min-w-0 break-words text-2xl font-semibold tracking-tight md:text-3xl">
                {{ title }}
              </h1>
              <span v-if="badge" class="material-chip tonal">
                {{ badge }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="$slots.aside" class="relative shrink-0">
          <slot name="aside" />
        </div>
      </div>
    </div>

    <div class="feature-grid border-x border-b border-border/80 p-4 md:p-5">
      <slot />
    </div>

    <div v-if="$slots.footer" class="pt-1">
      <slot name="footer" />
    </div>
  </section>
</template>
