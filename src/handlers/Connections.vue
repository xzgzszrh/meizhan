<script setup>
import { computed, inject } from 'vue'
import { Card, CardDescription, CardTitle } from '@/components/ui/card/index.js'
import { DiscordIcon, GitHubIcon, GoogleIcon } from 'vue3-simple-icons'
import ConnectorCard from '@/components/Pages/Connections/ConnectorCard.vue'
import PageSection from '@/components/Base/PageSection.vue'
import { Cable, MessageCircleMore, Globe } from 'lucide-vue-next'

const userData = inject('userData')

const connectionItems = computed(() => [
  {
    service: 'Google',
    target: 'google',
    icon: GoogleIcon,
    linked: Boolean(userData?.value?.identities?.google),
    description: '绑定 Google 后，可使用 Google 账号快捷登录，并同步其基础身份信息。'
  },
  {
    service: 'GitHub',
    target: 'github',
    icon: GitHubIcon,
    linked: Boolean(userData?.value?.identities?.github),
    description: '适合开发者用户。绑定后可使用 GitHub 身份完成登录与后续账号识别。'
  },
  {
    service: 'Discord',
    target: 'discord',
    icon: DiscordIcon,
    linked: Boolean(userData?.value?.identities?.discord),
    description: '绑定 Discord 后，可通过 Discord 账号快速登录当前用户中心。'
  },
  {
    service: 'QQ',
    target: 'qq',
    icon: MessageCircleMore,
    linked: Boolean(userData?.value?.identities?.qq),
    description: '适用于国内常见账号体系，绑定后可直接使用 QQ 进行身份授权。'
  },
  {
    service: 'LinuxDO',
    target: 'linuxdo',
    icon: Globe,
    linked: Boolean(userData?.value?.identities?.linuxdo),
    description: 'LinuxDO 采用 OAuth 协议接入，只要你已在 Logto 中完成配置，即可在此直接绑定。'
  }
])
</script>

<template>
  <PageSection
    title="账号连接"
    :icon="Cable"
    badge="第三方授权"
    description="在这里查看并管理已绑定的第三方账号。保留原有授权、解绑与弹窗连接逻辑，仅对交互与视觉层进行全面升级。"
  >
    <ConnectorCard
      v-for="item in connectionItems"
      :key="item.target"
      :linked="item.linked"
      :icon="item.icon"
      :service="item.service"
      :target="item.target"
      :description="item.description"
    />
    <template #footer>
      <div class="section-card p-6">
        <CardTitle class="text-lg">已授权应用</CardTitle>
        <CardDescription class="mt-2">
          这里会展示你授权访问账户数据的第三方应用列表。
        </CardDescription>
        <Card class="mt-5 w-full border border-dashed bg-background/60 p-4 shadow-none">
          <CardDescription class="flex gap-x-2 text-sm">
            当前还没有任何已授权应用。
          </CardDescription>
        </Card>
      </div>
    </template>
  </PageSection>
</template>
