<script setup>
import EditDeveloperStatus from '@/components/Pages/DeveloperOptions/EditDeveloperStatus.vue'
import PageSection from '@/components/Base/PageSection.vue'
import { Code } from 'lucide-vue-next'
</script>

<template>
  <PageSection
    title="开发者选项"
    :icon="Code"
    badge="高级能力"
    description="开启开发者身份后，你将获得开发者后台权限，可继续创建和管理应用。保留原有功能，仅重做视觉与中文文案。"
  >
    <EditDeveloperStatus />
  </PageSection>
</template>
