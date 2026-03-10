<script setup>
import {Button} from '@/components/ui/button/index.js'
import {Plus} from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm">You do not have a phone number attached to your account.</p>
    <Button class="h-8 font-bold" variant="secondary">
      <Plus class="pr-1" />
      Add Phone Number
    </Button>
  </div>
</template>

<style scoped></style>
