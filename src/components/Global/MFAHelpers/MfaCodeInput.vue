<script setup>
import { ref } from 'vue'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input/index.js'
import Button from '../../ui/button/Button.vue'

defineProps({
  resendCodeTimer: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['codeComplete', 'resendCode', 'changeInput'])
const value = ref([])

const handleComplete = (e) => emit('codeComplete', e.join(''))
</script>

<template>
  <div class="flex w-full max-w-[420px] flex-col items-center gap-4 text-center">
    <h3 class="font-bold leading-6">请输入发送给你的 6 位验证码</h3>
    <div class="w-full space-y-4">
      <PinInput
        id="pin-input"
        v-model="value"
        placeholder="○"
        @complete="handleComplete"
        otp
        type="number"
        required
      >
        <PinInputGroup class="flex w-full justify-center gap-2 sm:gap-3">
          <template v-for="(id, index) in 6" :key="id">
            <PinInputInput class="bg-secondary text-foreground" :index="index" />
          </template>
        </PinInputGroup>
      </PinInput>
      <div class="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-around">
        <Button
          :disabled="resendCodeTimer > 0"
          variant="link"
          class="text-xs"
          @click="emit('resendCode')"
        >
          {{ resendCodeTimer <= 0 ? '重新发送验证码' : `${resendCodeTimer}s 后可重新发送` }}
        </Button>
        <Button variant="link" class="text-xs" @click="emit('changeInput')"> 更换验证方式 </Button>
      </div>
    </div>
  </div>
</template>
