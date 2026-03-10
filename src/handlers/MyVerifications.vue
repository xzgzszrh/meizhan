<script setup>
import { computed, inject } from 'vue'
import PageSection from '@/components/Base/PageSection.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card/index.js'
import { BadgeCheck, Building2, ShieldCheck } from 'lucide-vue-next'

const userData = inject('userData')

const organizations = computed(() => {
  const rawOrganizations = userData?.value?.organizations

  if (Array.isArray(rawOrganizations)) {
    return rawOrganizations.map((item) =>
      typeof item === 'string' ? item : item?.id || item?.organizationId || ''
    )
  }

  if (rawOrganizations && typeof rawOrganizations === 'object') {
    return Object.keys(rawOrganizations)
  }

  return []
})

const certificationItems = computed(() => {
  const organizationIds = new Set(organizations.value)

  return [
    {
      id: 'qs6c6kl7yaw8',
      title: '莓站-群友认证',
      description: '已加入莓站群友组织，可享受对应的社区身份展示。',
      active: organizationIds.has('qs6c6kl7yaw8'),
      activeCardClass: 'border border-emerald-300/50 bg-emerald-100/70',
      activeIconClass: 'border border-emerald-300/50 bg-emerald-200/70 text-emerald-700',
      activeStatusClass: 'border-emerald-300/50 bg-emerald-50/90 text-emerald-900'
    },
    {
      id: 'ogyizr4r62uu',
      title: '莓站-赞助认证',
      description: '已获得莓站赞助身份，可展示对应的赞助认证标识。',
      active: organizationIds.has('ogyizr4r62uu'),
      activeCardClass: 'border border-amber-300/60 bg-amber-200/65',
      activeIconClass: 'border border-amber-300/60 bg-amber-300/70 text-amber-900',
      activeStatusClass: 'border-amber-300/60 bg-amber-100/90 text-amber-950'
    }
  ]
})

const hasAnyCertification = computed(() => certificationItems.value.some((item) => item.active))
</script>

<template>
  <PageSection
    title="我的认证"
    :icon="BadgeCheck"
    badge="Identity"
    description="这里会根据当前账户加入的组织，自动展示你已获得的站内认证。"
  >
    <div v-if="!hasAnyCertification" class="section-card p-6 text-center">
      <BadgeCheck class="mx-auto text-muted-foreground" :size="28" />
      <h3 class="mt-4 text-lg font-semibold">您还没有任何认证</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        请您联系管理员为您添加认证。完成后，这里会自动点亮对应的认证状态。
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card
        v-for="item in certificationItems"
        :key="item.id"
        :class="
          item.active
            ? ['section-card', item.activeCardClass]
            : 'section-card border border-border/70 bg-background/55 opacity-60'
        "
      >
        <CardHeader class="space-y-3 p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div
                :class="item.active ? 'material-chip tonal' : 'material-chip'"
                class="mb-2 w-fit"
              >
                {{ item.active ? '已认证' : '未认证' }}
              </div>
              <CardTitle class="flex items-center gap-2 text-lg">
                <Building2 :size="18" />
                <span>{{ item.title }}</span>
              </CardTitle>
            </div>
            <div
              :class="
                item.active
                  ? item.activeIconClass
                  : 'border border-border/70 bg-secondary/50 text-muted-foreground'
              "
              class="flex h-10 w-10 items-center justify-center"
            >
              <ShieldCheck :size="18" />
            </div>
          </div>
          <CardDescription class="text-sm leading-6 text-muted-foreground">
            {{ item.description }}
          </CardDescription>
        </CardHeader>
        <CardContent class="px-5 pb-5 pt-0">
          <div
            :class="
              item.active
                ? item.activeStatusClass
                : 'border-border/70 bg-secondary/40 text-muted-foreground'
            "
            class="border px-3 py-3 text-sm"
          >
            {{ item.active ? '当前账户已拥有此认证。' : '当前账户尚未拥有此认证。' }}
          </div>
        </CardContent>
      </Card>
    </div>
  </PageSection>
</template>
