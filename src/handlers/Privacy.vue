<script setup>
import { BarChart3, Send, TextSearch } from 'lucide-vue-next'
import MfaVerificationDialog from '@/components/Global/MFAHelpers/MfaVerificationDialog.vue'
import PageSection from '@/components/Base/PageSection.vue'
</script>

<template>
  <PageSection
    title="隐私与数据使用"
    :icon="TextSearch"
    badge="即将开放更多设置"
    description="查看你愿意共享的信息，以及后续将支持的账户隐私保护能力。当前模块保持原有占位逻辑不变，仅全面汉化并重构展示方式。"
  >
    <div
      class="section-card flex flex-col gap-4 p-5 md:col-span-2 md:flex-row md:items-center md:justify-between"
    >
      <div class="md:w-2/3">
        <h3 class="text-lg font-semibold">第三方数据访问</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          控制第三方应用访问你账户资料的方式。完全阻止后，相关产品在请求时将无法获取你的详细信息。
        </p>
      </div>
      <MfaVerificationDialog title="第三方数据访问" :icon="TextSearch" desc="全部阻止" disabled />
    </div>
    <div
      class="section-card flex flex-col gap-4 p-5 md:col-span-2 md:flex-row md:items-center md:justify-between"
    >
      <div class="md:w-2/3">
        <h3 class="text-lg font-semibold">分析模式</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          分析数据可帮助我们优化产品体验。启用后，将基于隐私化处理后的账户行为数据生成统计信息。
        </p>
      </div>
      <MfaVerificationDialog title="分析模式" :icon="BarChart3" desc="当前未加入" disabled />
    </div>
    <div
      class="section-card flex flex-col gap-4 p-5 md:col-span-2 md:flex-row md:items-center md:justify-between"
    >
      <div class="md:w-2/3">
        <h3 class="text-lg font-semibold">邮箱隐私</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          未来可通过代理邮箱保护真实地址，减少在其他产品中的暴露风险。
        </p>
      </div>
      <MfaVerificationDialog title="邮箱隐私" :icon="Send" desc="隐藏并启用代理邮箱" disabled />
    </div>
  </PageSection>
</template>
