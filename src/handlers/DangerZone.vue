<script setup>
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion/index.js'
import TerminateAccount from '@/components/Pages/DangerZone/TerminateAccount.vue'
import SuspendAccount from '@/components/Pages/DangerZone/SuspendAccount.vue'
import PageSection from '@/components/Base/PageSection.vue'
import { AlertTriangle } from 'lucide-vue-next'
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <PageSection
    title="危险操作"
    :icon="AlertTriangle"
    badge="高风险区域"
    :danger="true"
    description="以下操作具有破坏性，可能影响你的登录状态、数据可用性或账户本身。所有原有防误触逻辑与倒计时确认将完整保留。"
  >
    <div class="section-card p-5 md:col-span-2">
      <div
        class="mb-4 rounded-[var(--radius-surface)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
      >
        请仅在确认理解后继续。暂停和注销均属于不可逆或高影响操作。
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger class="text-red-600">我已了解风险，展开账户操作</AccordionTrigger>
          <AccordionContent class="space-y-3">
            <SuspendAccount />
            <TerminateAccount />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </PageSection>
</template>

<style scoped></style>
