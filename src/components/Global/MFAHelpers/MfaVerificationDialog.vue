<script setup>
import { computed, inject, onUnmounted, ref, watch } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import Input from '@/components/ui/input/Input.vue'
import { Label } from '@/components/ui/label/index.js'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group/index.js'
import { useLogto } from '@logto/vue'
import {
  ArrowRight,
  KeyRound,
  Loader,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  SmartphoneNfc,
  Undo2
} from 'lucide-vue-next'
import axios from 'redaxios'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog/index.js'
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip/index.js'
import { Button } from '@/components/ui/button/index.js'
import MfaCodeInput from '@/components/Global/MFAHelpers/MfaCodeInput.vue'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index.js'
import { API } from '@/lib/apiRouteMap.js'

const userData = inject('userData')
const mfaOptions = inject('mfaMethods')

defineProps({
  title: { type: String, required: true },
  icon: { required: true },
  desc: { type: String, required: false },
  disabled: { type: Boolean, default: false },
  edit: { type: Boolean, default: false }
})

const { getAccessToken } = useLogto()
const isMfaRequired = ref(false)
const codeSent = ref(false)
const isLoading = ref(true)
const accessTokenRef = ref('')
const selectedMfaMethod = ref('email')
const resendCodeTimer = ref(60)
const readyToSend = ref(true)
const currentPassword = ref('')
const passwordError = ref('')
const isOpen = defineModel({ default: false })

const userEmail = computed(() => userData?.value?.email || userData?.value?.primaryEmail || '')
const userPhone = computed(
  () => userData?.value?.phone_number || userData?.value?.primaryPhone || ''
)
const hasPhone = computed(() => Boolean(userPhone.value))
const hasAuthenticator = computed(() => Boolean(mfaOptions?.value?.totp))
const hasBackupCodes = computed(() => Boolean(mfaOptions?.value?.backup))
const defaultVerificationMethod = computed(() => (userEmail.value ? 'email' : 'password'))

const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

async function sendVerificationCode() {
  isLoading.value = true
  let failed = false
  try {
    const response = await axios.post(
      selectedMfaMethod.value === 'email' ? API.MFA.FLOW.EMAIL.PUSH : API.MFA.FLOW.SMS.PUSH,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    codeSent.value = response.status === 204
  } catch (error) {
    toast.error('Error sending verification code:', { description: error })
    codeSent.value = false
    failed = true
  } finally {
    isLoading.value = false
    resendCodeTimer.value = 60
    countdown()
    if (selectedMfaMethod.value === 'email' && !failed) {
      toast.info('Sent Email to ' + userEmail.value, {
        description: 'Code will last for 10 minutes.'
      })
    } else if (selectedMfaMethod.value === 'sms' && !failed) {
      toast.info('Sent Text to ' + userPhone.value, {
        description: 'Code will last for 10 minutes.'
      })
    }
  }
}

async function verifyWithPassword() {
  if (!currentPassword.value) {
    passwordError.value = '请输入当前密码'
    return
  }

  isLoading.value = true
  passwordError.value = ''

  try {
    const response = await axios.post(
      API.MFA.FLOW.PASSWORD.VERIFY,
      {
        password: currentPassword.value
      },
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 204) {
      currentPassword.value = ''
      isMfaRequired.value = false
      toast.success('Successfully Verified', {
        description: 'You will stay verified for the next 15 minutes.'
      })
    }
  } catch (error) {
    passwordError.value =
      error?.response?.status === 406
        ? '当前密码不正确，或此账号未设置本地密码'
        : '密码验证失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

async function handleCodeResend() {
  await sendVerificationCode()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function handleChangeInput() {
  readyToSend.value = false
  codeSent.value = false
  sleep(resendCodeTimer.value * 1000).then(() => {
    readyToSend.value = true
  })
}

const handleCodeComplete = async (code) => {
  isLoading.value = true
  try {
    const response = await axios.post(
      `${selectedMfaMethod.value === 'email' ? API.MFA.FLOW.EMAIL.VERIFY : API.MFA.FLOW.SMS.VERIFY}?verification-code=${code}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      codeSent.value = false
      isMfaRequired.value = false
      toast.success('Successfully Verified', {
        description: 'You will stay verified for the next 15 minutes.'
      })
    }
  } catch (error) {
    toast.warning('Provided Code is Incorrect', {
      description: 'Please try again'
    })
  } finally {
    isLoading.value = false
  }
}

const checkMFA = async () => {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  accessTokenRef.value = accessToken
  try {
    const response = await axios.get(API.MFA.REQUIRED, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    isMfaRequired.value = response.data.status === true
  } catch (error) {
    toast.error('Error checking MFA:', { description: 'Service Unavailable. Try again later' })
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  } finally {
    isLoading.value = false
  }
}

function updateSelectedMethod(value) {
  selectedMfaMethod.value = value
  passwordError.value = ''
  if (value !== 'password') {
    currentPassword.value = ''
  }
}

async function handleVerificationStart() {
  if (selectedMfaMethod.value === 'password') {
    await verifyWithPassword()
    return
  }

  await sendVerificationCode()
}
watch(isOpen, () => {
  if (isOpen.value) {
    selectedMfaMethod.value = defaultVerificationMethod.value
    currentPassword.value = ''
    passwordError.value = ''
    codeSent.value = false
    checkMFA()
  }
})
const handleEvent = (data) => {
  isOpen.value = data
}
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)

onUnmounted(cleanup)

const [UseTriggerTemplate, TriggerTemplate] = createReusableTemplate()
const [UseContentTemplate, ContentTemplate] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseTriggerTemplate>
    <Card
      class="section-card h-full min-h-40 w-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:cursor-pointer hover:shadow-lg"
    >
      <CardHeader class="relative space-y-4 p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="material-chip mb-2">账户功能</div>
            <CardTitle class="flex justify-between text-lg font-semibold">
              {{ title }}
            </CardTitle>
          </div>
          <div class="rounded-lg bg-secondary p-3 text-secondary-foreground">
            <component :is="icon" v-if="icon" />
          </div>
        </div>
        <CardDescription class="text-sm leading-6">{{ desc }}</CardDescription>
      </CardHeader>
    </Card>
  </UseTriggerTemplate>

  <UseContentTemplate>
    <div class="flex h-full min-h-0 w-full flex-col">
      <transition name="fade">
        <DialogHeader class="shrink-0 border-b border-border/80 px-4 py-4 text-center sm:px-6">
          <div class="flex flex-col items-center gap-2">
            <component class="mr-1" height="42" width="42" :is="isMfaRequired ? Shield : icon" />
            <DialogTitle class="flex items-center align-middle">{{
              isMfaRequired ? '验证你的身份' : !edit ? '编辑' + title : title
            }}</DialogTitle>
            <DialogDescription class="space-y-1">
              <div class="flex flex-col items-center text-xs">
                {{ isMfaRequired ? '为了确认是你本人在操作，请选择一种方式完成身份验证。' : '' }}
                <Popover>
                  <PopoverTrigger>
                    <Button v-if="isMfaRequired" variant="link" size="xs" class="text-xs">
                      这是什么？
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p class="text-sm text-center">
                      当前你的账户已开启
                      <strong> 登录验证 </strong>
                      ，因此在登录和修改敏感资料时，需要通过已添加的多重验证方式再次确认身份。你可以前往
                      <span>
                        <RouterLink to="/account/security?module=loginVerification">
                          登录与安全
                        </RouterLink>
                      </span>
                      页面调整该功能。
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
      </transition>
      <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <transition name="fade" mode="out-in">
          <div
            key="mfa-settings"
            v-if="!isLoading && isMfaRequired && !codeSent"
            class="flex min-h-full flex-col gap-4"
          >
            <div class="dialog-form-group w-full">
              <RadioGroup
                :default-value="defaultVerificationMethod"
                :model-value="selectedMfaMethod"
                class="space-y-3"
                @update:modelValue="updateSelectedMethod"
              >
                <div class="flex items-start gap-3 rounded-lg border border-border/70 p-3">
                  <RadioGroupItem id="r0" value="password" class="mt-1" />
                  <div
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/80 text-foreground/80"
                  >
                    <KeyRound class="h-4 w-4" />
                  </div>
                  <Label for="r0" class="flex-1 space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold">当前密码</span>
                    </div>
                    <p class="text-xs font-normal leading-5 text-muted-foreground">
                      直接输入当前密码完成身份确认
                    </p>
                  </Label>
                </div>
                <div class="flex items-start gap-3 rounded-lg border border-border/70 p-3">
                  <RadioGroupItem id="r1" value="email" class="mt-1" />
                  <div
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/80 text-foreground/80"
                  >
                    <Mail class="h-4 w-4" />
                  </div>
                  <Label for="r1" class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-semibold">邮箱验证码</span>
                      <span class="text-xs text-muted-foreground">{{ userEmail }}</span>
                    </div>
                    <p class="text-xs font-normal leading-5 text-muted-foreground">
                      发送验证码到绑定邮箱
                    </p>
                  </Label>
                </div>
                <div
                  v-if="hasPhone"
                  class="flex items-start gap-3 rounded-lg border border-border/70 p-3"
                >
                  <RadioGroupItem id="r2" value="sms" class="mt-1" />
                  <div
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/80 text-foreground/80"
                  >
                    <Phone class="h-4 w-4" />
                  </div>
                  <Label for="r2" class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-semibold">短信验证码</span>
                      <span class="text-xs text-muted-foreground">{{ userPhone }}</span>
                    </div>
                    <p class="text-xs font-normal leading-5 text-muted-foreground">
                      发送验证码到绑定手机号
                    </p>
                  </Label>
                </div>
                <div v-if="hasAuthenticator">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        class="flex w-full items-start gap-3 rounded-lg border border-border/50 p-3"
                      >
                        <RadioGroupItem id="r3" value="authenticator" disabled class="mt-1" />
                        <div
                          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground"
                        >
                          <SmartphoneNfc class="h-4 w-4" />
                        </div>
                        <Label for="r3" class="flex-1 space-y-1 text-muted-foreground">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="font-semibold">验证器应用</span>
                            <span class="text-xs">
                              {{ isDesktop ? '（Google / Microsoft Authenticator）' : '' }}
                            </span>
                          </div>
                          <p class="text-xs font-normal leading-5">
                            使用验证器生成的一次性验证码
                          </p>
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>暂未开放</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div v-if="hasBackupCodes">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        class="flex w-full items-start gap-3 rounded-lg border border-border/50 p-3"
                      >
                        <RadioGroupItem id="r4" value="codes" disabled class="mt-1" />
                        <div
                          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground"
                        >
                          <ShieldCheck class="h-4 w-4" />
                        </div>
                        <Label for="r4" class="flex-1 space-y-1 text-muted-foreground">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="font-semibold">备用恢复码</span>
                          </div>
                          <p class="text-xs font-normal leading-5">使用一次性的备用恢复码验证</p>
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>暂未开放</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </RadioGroup>
            </div>
            <div v-if="selectedMfaMethod === 'password'" class="dialog-form-group w-full">
              <Label for="current-password" class="mb-2 flex w-full justify-between font-bold">
                当前密码
              </Label>
              <Input
                id="current-password"
                v-model="currentPassword"
                type="password"
                placeholder="输入当前密码以继续"
                :class="passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''"
                @keydown.enter.prevent="handleVerificationStart"
              />
              <p v-if="passwordError" class="mt-2 text-sm text-red-500">
                {{ passwordError }}
              </p>
            </div>
          </div>
          <div
            v-else-if="!isLoading && isMfaRequired && codeSent"
            class="flex min-h-full items-center justify-center py-2"
          >
            <MfaCodeInput
              :resend-code-timer="resendCodeTimer"
              @codeComplete="handleCodeComplete"
              @resendCode="handleCodeResend"
              @changeInput="handleChangeInput"
            />
          </div>
          <div v-else-if="!isLoading && !isMfaRequired" class="w-full pt-2">
            <div class="dialog-form-shell">
              <slot name="body">
                哎呀，组件加载失败。<br />
                请刷新页面后重试。
              </slot>
            </div>
          </div>
          <div v-else-if="isLoading" class="flex min-h-[240px] items-center justify-center py-6">
            <Loader class="animate-spin" :size="32" />
          </div>
        </transition>
      </div>
      <DialogFooter
        v-if="isDesktop && !isLoading && isMfaRequired && !codeSent"
        class="dialog-footer-stack border-t border-border/70 px-4 pb-4 pt-4 sm:px-6"
      >
        <DialogClose as-child>
          <Button class="h-9 rounded-lg" type="button" variant="outline">
            取消
            <Undo2 class="pl-1" />
          </Button>
        </DialogClose>
        <Button
          :disabled="
            selectedMfaMethod === 'password'
              ? !currentPassword || isLoading
              : resendCodeTimer > 0 && !readyToSend
          "
          class="h-9 rounded-lg"
          @click="handleVerificationStart"
        >
          {{ selectedMfaMethod === 'password' ? '验证并继续' : '下一步' }}
          <ArrowRight class="pl-1" />
        </Button>
      </DialogFooter>
      <DrawerFooter
        v-else-if="!isDesktop && !isLoading && isMfaRequired && !codeSent"
        class="w-full px-4 pb-4 pt-4 sm:px-6"
      >
        <div class="w-full space-y-3">
          <div class="flex w-full justify-center space-x-2">
            <p
              class="text-xs"
              v-if="selectedMfaMethod !== 'password' && resendCodeTimer > 0 && !readyToSend"
            >
              请等待 {{ resendCodeTimer }} 秒后再重新发送
            </p>
          </div>
          <DialogClose as-child>
            <Button class="w-full rounded-lg" type="button" variant="outline">
              取消
              <Undo2 class="pl-1" />
            </Button>
          </DialogClose>
          <Button
            :disabled="
              selectedMfaMethod === 'password'
                ? !currentPassword || isLoading
                : resendCodeTimer > 0 && !readyToSend
            "
            class="w-full rounded-lg"
            @click="handleVerificationStart"
          >
            {{ selectedMfaMethod === 'password' ? '验证并继续' : '下一步' }}
            <ArrowRight class="pl-1" />
          </Button>
        </div>
      </DrawerFooter>
      <DialogFooter
        v-else-if="isDesktop && !isLoading && !isMfaRequired"
        class="dialog-footer-stack w-full border-t border-border/70 px-4 pb-4 pt-4 sm:px-6"
      >
        <slot name="footer" />
      </DialogFooter>
      <DrawerFooter v-else-if="!isDesktop && !isLoading && !isMfaRequired" class="w-full px-4 pb-4 pt-4 sm:px-6">
        <slot name="drawerFooter" />
      </DrawerFooter>
    </div>
  </UseContentTemplate>

  <Card
    v-if="disabled"
    class="section-card h-full min-h-40 w-full border border-dashed border-border/80 opacity-70 hover:cursor-default"
  >
    <CardHeader class="p-5">
      <CardTitle class="flex justify-between text-lg text-muted-foreground">
        {{ title }}
        <component :is="icon" v-if="icon" class="text-muted-foreground" />
      </CardTitle>
      <CardDescription class="text-muted-foreground">
        {{ desc }}
      </CardDescription>
    </CardHeader>
  </Card>

  <Dialog v-if="!disabled && isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot>
        <TriggerTemplate />
      </slot>
    </DialogTrigger>
    <DialogContent
      class="flex h-[min(88dvh,720px)] w-[min(92vw,640px)] max-w-[640px] flex-col overflow-hidden rounded-[var(--radius-overlay)] border border-border bg-card p-0 shadow-2xl"
      @interact-outside="
        (event) => {
          const target = event.target
          if (target?.closest('[data-sonner-toaster]')) return event.preventDefault()
        }
      "
    >
      <ContentTemplate />
    </DialogContent>
  </Dialog>
  <Drawer v-else-if="!disabled" v-model:open="isOpen">
    <DrawerTrigger as-child>
      <slot>
        <TriggerTemplate />
      </slot>
    </DrawerTrigger>
    <DrawerContent
      class="max-h-[92dvh] w-full overflow-hidden rounded-t-[var(--radius-surface)] border-none bg-card px-0 pb-0"
    >
      <ContentTemplate />
    </DrawerContent>
  </Drawer>
</template>
