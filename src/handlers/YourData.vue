<script setup>
import { HardDriveDownload, LifeBuoy } from 'lucide-vue-next'
import MfaVerificationDialog from '@/components/Global/MFAHelpers/MfaVerificationDialog.vue'
import PageSection from '@/components/Base/PageSection.vue'
</script>

<template>
  <PageSection
    title="我的数据"
    :icon="LifeBuoy"
    badge="数据导出"
    description="你可以在这里申请导出账户数据副本。当前功能保持原有占位逻辑，但整体视觉与文案已更新为更清晰的中文风格。"
  >
    <div class="section-card p-6 md:col-span-2">
      <div class="grid gap-4 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div>
          <h3 class="text-lg font-semibold">导出说明</h3>
          <p class="mt-3 text-sm leading-7 text-muted-foreground">
            选择需要的数据后，我们会开始准备你的数据副本。整个过程最长可能需要 7
            天，以便系统完成身份校验并确保请求确实由你本人发起。
          </p>
          <div class="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              · 包含个人资料、隐私设置、连接关系、安全设置、数据历史和开发者相关信息，格式通常为
              JSON。
            </p>
            <p>· 包含你上传的头像等媒体文件，通常会以 Web 优化后的 WebP 格式提供。</p>
          </div>
        </div>
        <MfaVerificationDialog
          title="申请导出数据"
          :icon="HardDriveDownload"
          desc="导出链接将通过邮件发送，并在 72 小时内有效。"
          disabled
          edit
        />
      </div>
    </div>
  </PageSection>
</template>
