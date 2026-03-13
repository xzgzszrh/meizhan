<script setup>
import { computed, inject } from 'vue'
import EditBirthdayDialog from '@/components/Pages/PersonalInfo/EditBirthdayDialog.vue'
import EditRegionalSettings from '@/components/Pages/PersonalInfo/EditRegionalSettings.vue'
import EditLocaleSettings from '@/components/Pages/PersonalInfo/EditLocaleSettings.vue'
import EditFullName from '@/components/Pages/PersonalInfo/EditFullName.vue'
import EditUsername from '@/components/Pages/PersonalInfo/EditUsername.vue'
import AvatarEditor from '@/components/Base/Avatar/AvatarEditor.vue'
import PageSection from '@/components/Base/PageSection.vue'
import { Button } from '@/components/ui/button/index.js'
import { toast } from 'vue-sonner'
import {
  BadgeCheck,
  CalendarFold,
  CircleUserRound,
  Copy,
  Globe,
  Languages,
  ShieldCheck,
  Sparkles,
  SquareArrowOutUpRight
} from 'lucide-vue-next'

const userData = inject('userData')

const displayName = computed(
  () => userData?.value?.name || userData?.value?.username || '未命名用户'
)
const usernameText = computed(() =>
  userData?.value?.username ? `@${userData.value.username}` : '尚未设置用户名'
)
const emailText = computed(() => userData?.value?.email || '未绑定邮箱')
const birthdayText = computed(
  () => userData?.value?.profile?.birthdate || userData?.value?.birthdate || '未设置'
)
const regionText = computed(
  () =>
    userData?.value?.profile?.address?.country ||
    userData?.value?.['profile.address.country'] ||
    '未设置'
)
const localeText = computed(
  () => userData?.value?.profile?.locale || userData?.value?.locale || '未设置'
)

const profileMetrics = computed(() => [
  Boolean(userData?.value?.avatar),
  Boolean(userData?.value?.name),
  Boolean(userData?.value?.username),
  Boolean(userData?.value?.profile?.birthdate || userData?.value?.birthdate),
  Boolean(
    userData?.value?.profile?.address?.country || userData?.value?.['profile.address.country']
  ),
  Boolean(userData?.value?.profile?.locale || userData?.value?.locale)
])
const completedFields = computed(() => profileMetrics.value.filter(Boolean).length)
const completionRate = computed(() =>
  Math.round((completedFields.value / profileMetrics.value.length) * 100)
)

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
      active: organizationIds.has('qs6c6kl7yaw8')
    },
    {
      id: 'ogyizr4r62uu',
      title: '莓站-赞助认证',
      active: organizationIds.has('ogyizr4r62uu')
    }
  ]
})

const activeCertifications = computed(() =>
  certificationItems.value.filter((item) => item.active)
)

const copyAccountId = async () => {
  const accountId = userData?.value?.sub
  if (!accountId) return

  try {
    await navigator.clipboard.writeText(accountId)
    toast.success('账户编号已复制')
  } catch (error) {
    toast.error('复制失败，请稍后重试')
  }
}
</script>

<template>
  <PageSection
    title="个人资料"
    :icon="CircleUserRound"
    :badge="`已完善 ${completedFields}/${profileMetrics.length} 项`"
    description="这里集中管理你的头像、公开身份与个人偏好。头像编辑已经迁移到当前页面，侧边栏只保留头像展示。"
  >
    <div class="space-y-4">
      <section class="section-card overflow-hidden">
        <div class="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.8fr)] lg:p-6">
          <div class="space-y-5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="material-chip tonal">资料概览</span>
              <span class="material-chip">
                <ShieldCheck :size="12" />
                已登录
              </span>
            </div>

            <div class="flex items-center gap-4">
              <AvatarEditor
                :avatar-url="userData.avatar || ''"
                :user-name="userData.username || userData.name || '用户'"
              />
              <div class="min-w-0 space-y-2">
                <h2 class="truncate text-3xl font-semibold tracking-tight md:text-4xl">
                  {{ displayName }}
                </h2>
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span>{{ usernameText }}</span>
                  <span>{{ emailText }}</span>
                </div>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <div class="border border-border/70 bg-secondary/35 p-3">
                <div
                  class="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                >
                  <CalendarFold :size="14" />
                  生日
                </div>
                <div class="mt-2 text-sm font-semibold text-foreground">{{ birthdayText }}</div>
              </div>
              <div class="border border-border/70 bg-secondary/35 p-3">
                <div
                  class="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                >
                  <Globe :size="14" />
                  地区
                </div>
                <div class="mt-2 text-sm font-semibold text-foreground">{{ regionText }}</div>
              </div>
              <div class="border border-border/70 bg-secondary/35 p-3">
                <div
                  class="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                >
                  <Languages :size="14" />
                  语言
                </div>
                <div class="mt-2 text-sm font-semibold text-foreground">{{ localeText }}</div>
              </div>
            </div>

            <div class="border border-border/70 bg-secondary/35 p-3">
              <div
                class="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
              >
                <BadgeCheck :size="14" />
                认证信息
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="item in certificationItems"
                  :key="item.id"
                  class="material-chip"
                  :class="item.active ? 'tonal' : ''"
                >
                  {{ item.title }}
                  <span class="ml-1 text-[10px]">{{ item.active ? '已认证' : '未认证' }}</span>
                </span>
              </div>
              <p class="mt-3 text-sm text-muted-foreground">
                {{
                  activeCertifications.length
                    ? `当前已获得 ${activeCertifications.length} 项认证`
                    : '当前暂未获得认证，可联系管理员开通'
                }}
              </p>
              <Button as-child variant="secondary" class="mt-3 h-8 rounded-lg border border-border/70">
                <router-link to="/account/verifications">查看认证详情</router-link>
              </Button>
            </div>
          </div>

          <div
            class="flex flex-col justify-between gap-4 border-t border-border/70 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"
          >
            <div>
              <div class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                资料完整度
              </div>
              <div class="mt-3 flex items-end gap-3">
                <strong class="text-4xl font-semibold tracking-tight">{{ completionRate }}%</strong>
                <span class="pb-1 text-sm text-muted-foreground">
                  {{ completedFields }}/{{ profileMetrics.length }} 项已完善
                </span>
              </div>
              <div class="mt-3 h-2 overflow-hidden bg-secondary">
                <div
                  class="h-full bg-primary transition-all duration-300"
                  :style="{ width: `${completionRate}%` }"
                />
              </div>
            </div>

            <div class="space-y-3">
              <div class="border border-border/70 bg-secondary/35 p-3">
                <div class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  账户编号
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <div class="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                    {{ userData.sub }}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    class="h-8 w-8 border border-border/70"
                    aria-label="复制账户编号"
                    @click="copyAccountId"
                  >
                    <Copy :size="14" />
                  </Button>
                </div>
              </div>

              <div class="border border-border/70 bg-secondary/35 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      群友专区
                    </div>
                    <div class="mt-2 text-sm leading-6 text-foreground">
                      进入莓站资源页，查看 AI 账号与会员订阅推荐。
                    </div>
                  </div>
                  <Sparkles :size="16" class="mt-0.5 text-primary" />
                </div>
                <Button as-child class="mt-3 h-9 w-full justify-between rounded-lg">
                  <router-link to="/account/resources">
                    查看群友资源
                    <SquareArrowOutUpRight :size="15" />
                  </router-link>
                </Button>
              </div>

              <p class="text-sm leading-6 text-muted-foreground">
                用户名、姓名、生日与地区信息已经按功能重新聚合；你可以按信息类型在下方逐项维护。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-4 xl:grid-cols-2">
        <section class="section-card space-y-4 p-5 lg:p-6">
          <div class="space-y-2">
            <div class="text-xs uppercase tracking-[0.22em] text-primary">身份展示</div>
            <h3 class="text-xl font-semibold tracking-tight">管理你的公开身份</h3>
            <p class="text-sm leading-6 text-muted-foreground">
              这里集中处理姓名和用户名，适合优先修改最常被他人看到的信息。
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <EditFullName />
            <EditUsername />
          </div>
        </section>

        <section class="section-card space-y-4 p-5 lg:p-6">
          <div class="space-y-2">
            <div class="text-xs uppercase tracking-[0.22em] text-primary">个人档案</div>
            <h3 class="text-xl font-semibold tracking-tight">补齐偏好与地区信息</h3>
            <p class="text-sm leading-6 text-muted-foreground">
              生日、地区和语言会影响资料完整度，也会用于个性化展示与区域设置。
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <EditBirthdayDialog />
            <EditRegionalSettings />
            <EditLocaleSettings />
          </div>
        </section>
      </div>
    </div>
  </PageSection>
</template>

<style scoped></style>
