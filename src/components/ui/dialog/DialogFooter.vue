<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
