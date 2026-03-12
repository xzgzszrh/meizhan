<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import PageSection from '@/components/Base/PageSection.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/index.js'
import { Button } from '@/components/ui/button/index.js'
import {
  ArrowRight,
  Bot,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  CircleDollarSign,
  Compass,
  ExternalLink,
  Gauge,
  HardDrive,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Sparkles
} from 'lucide-vue-next'

const currentTab = ref('ai')
const activeSlide = ref(0)

const bannerSlides = [
  {
    id: 'shop',
    chip: '莓站精选站点',
    title: '全网最高性价比的AI账号购买网站',
    description:
      '统一入口、稳定供给、价格透明。适合直接对比不同 AI 账号与订阅类型，快速完成下单。',
    buttonText: '进入AI商城',
    href: 'https://shop.bmoplus.com/#shop',
    icon: Sparkles,
    sideLabel: '综合选购入口',
    sideDesc: '可同时浏览多种账号与订阅资源。'
  },
  {
    id: 'gpt-plus-recharge',
    chip: '热门代充通道',
    title: '超低价GPT Plus代充量大价更优',
    description:
      '聚焦 GPT Plus 代充场景，适合批量采购或长期需求。页面可直接进入购买流程，节省筛选时间。',
    buttonText: '前往 GPT Plus 代充',
    href: 'https://shop.bmoplus.com/item/26#buy',
    icon: CircleDollarSign,
    sideLabel: '批量更优价格',
    sideDesc: '单点直达，不需要在商城内重复查找。'
  }
]

const idcPromotions = [
  {
    title: '5元即可拥有属于你的小龙虾-openclaw安全高可用解决方案',
    summary: '入门成本低，轻量业务也能快速拥有稳定可用能力。',
    icon: ShieldCheck
  },
  {
    title: '宁波精品云服务器 最佳单线跨网解决方案，三网互通异地异网优化',
    summary: '适合跨地区访问场景，强调单线跨网稳定与互通质量。',
    icon: Network
  },
  {
    title: '内蒙性能云 三网优化电信线路，超大数据盘',
    summary: '偏重性能与容量，适用于需要大盘与高吞吐的任务。',
    icon: HardDrive
  },
  {
    title: '高防SCDN 多节点负载均衡，集群防御高达2TB',
    summary: '多节点联防与流量分散，面向高峰流量与攻击防护场景。',
    icon: CloudCog
  }
]
const idcTargetUrl = 'https://ikunyun.cn'

const isDesktop3D = useMediaQuery('(min-width: 1024px)')
const defaultSceneState = {
  rotateX: -12,
  rotateY: 17,
  translateX: 0,
  translateY: 0,
  glowX: 52,
  glowY: 28
}
const idcSceneState = ref({ ...defaultSceneState })

const idcSceneStyle = computed(() => ({
  '--idc-rx': `${idcSceneState.value.rotateX}deg`,
  '--idc-ry': `${idcSceneState.value.rotateY}deg`,
  '--idc-tx': `${idcSceneState.value.translateX}px`,
  '--idc-ty': `${idcSceneState.value.translateY}px`,
  '--idc-glow-x': `${idcSceneState.value.glowX}%`,
  '--idc-glow-y': `${idcSceneState.value.glowY}%`
}))

const resetIdcScene = () => {
  idcSceneState.value = { ...defaultSceneState }
}

const handleIdcSceneMove = (event) => {
  if (!isDesktop3D.value) return
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  const rect = target.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  idcSceneState.value = {
    rotateX: -12 - y * 18,
    rotateY: 17 + x * 22,
    translateX: x * 11,
    translateY: y * 9,
    glowX: 50 + x * 20,
    glowY: 32 + y * 16
  }
}

const totalSlides = computed(() => bannerSlides.length)

let slideTimer = null

const stopBannerAutoplay = () => {
  if (!slideTimer) return
  window.clearInterval(slideTimer)
  slideTimer = null
}

const startBannerAutoplay = () => {
  stopBannerAutoplay()
  slideTimer = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % totalSlides.value
  }, 6200)
}

const goToSlide = (index) => {
  activeSlide.value = index
  startBannerAutoplay()
}

const prevSlide = () => {
  goToSlide((activeSlide.value - 1 + totalSlides.value) % totalSlides.value)
}

const nextSlide = () => {
  goToSlide((activeSlide.value + 1) % totalSlides.value)
}

onMounted(startBannerAutoplay)
onUnmounted(() => {
  stopBannerAutoplay()
  resetIdcScene()
})
</script>

<template>
  <PageSection
    title="莓站资源"
    :icon="Compass"
    badge="群友资源导航"
    description="这里聚合群友常用的账号与服务入口，当前先提供 AI 账号与订阅专区。"
  >
    <Tabs v-model="currentTab" class="space-y-4">
      <section class="section-card overflow-hidden p-3 md:p-4">
        <TabsList
          class="!grid !h-auto w-full !grid-cols-1 !gap-2 !bg-transparent !p-0 md:!grid-cols-2"
        >
          <TabsTrigger
            value="ai"
            class="h-auto items-start justify-between gap-3 rounded-lg border border-border/80 bg-background/80 px-4 py-3 text-left data-[state=active]:border-primary/45 data-[state=active]:bg-primary/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <div>
              <div class="text-base font-semibold">AI账号与订阅</div>
              <p class="mt-1 text-sm font-normal text-muted-foreground">
                GPT Plus、Gemini Ultra、验证卡等常用资源入口
              </p>
            </div>
            <Bot :size="18" class="shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="idc"
            class="h-auto items-start justify-between gap-3 rounded-lg border border-border/80 bg-background/80 px-4 py-3 text-left data-[state=active]:border-primary/45 data-[state=active]:bg-primary/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <div>
              <div class="text-base font-semibold">IDC服务器</div>
              <p class="mt-1 text-sm font-normal text-muted-foreground">
                云服务器、带宽与节点资源将放在这里
              </p>
            </div>
            <Server :size="18" class="shrink-0" />
          </TabsTrigger>
        </TabsList>
      </section>

      <TabsContent value="ai" class="mt-0 space-y-4">
        <section class="section-card overflow-hidden">
          <div class="relative">
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,hsla(313,64%,56%,0.16),transparent_52%)]" />
            <div class="overflow-hidden border-b border-border/75">
              <div
                class="flex transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
              >
                <article
                  v-for="slide in bannerSlides"
                  :key="slide.id"
                  class="min-w-full p-5 md:p-8"
                >
                  <div class="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
                    <div class="space-y-4">
                      <span class="material-chip tonal w-fit">{{ slide.chip }}</span>
                      <h3 class="max-w-[22ch] text-2xl font-semibold tracking-tight md:text-3xl">
                        {{ slide.title }}
                      </h3>
                      <p class="max-w-[60ch] text-sm leading-7 text-muted-foreground">
                        {{ slide.description }}
                      </p>
                      <Button as-child class="h-10 rounded-lg px-4">
                        <a :href="slide.href" target="_blank" rel="noopener noreferrer">
                          {{ slide.buttonText }}
                          <ArrowRight :size="16" class="ml-2" />
                        </a>
                      </Button>
                    </div>

                    <div
                      class="banner-side-card relative overflow-hidden rounded-[var(--radius-surface)] border border-border/70 bg-background/75 p-4 md:p-5"
                    >
                      <div class="relative z-10">
                        <div class="flex items-center justify-between">
                          <div class="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            推广横幅
                          </div>
                          <component :is="slide.icon" :size="18" class="text-primary" />
                        </div>
                        <div class="mt-4 text-lg font-semibold tracking-tight text-foreground">
                          {{ slide.sideLabel }}
                        </div>
                        <p class="mt-2 text-sm leading-6 text-muted-foreground">
                          {{ slide.sideDesc }}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 p-4">
            <div class="flex items-center gap-2">
              <button
                v-for="(slide, index) in bannerSlides"
                :key="`${slide.id}-dot`"
                type="button"
                :aria-label="`切换到横幅 ${index + 1}`"
                class="h-2.5 rounded-full transition-all duration-300"
                :class="index === activeSlide ? 'w-8 bg-primary' : 'w-2.5 bg-border/80 hover:bg-border'"
                @click="goToSlide(index)"
              />
            </div>

            <div class="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                class="h-9 w-9 rounded-lg border border-border/80"
                aria-label="上一页横幅"
                @click="prevSlide"
              >
                <ChevronLeft :size="15" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                class="h-9 w-9 rounded-lg border border-border/80"
                aria-label="下一页横幅"
                @click="nextSlide"
              >
                <ChevronRight :size="15" />
              </Button>
            </div>
          </div>
        </section>

        <div class="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
          <section class="section-card relative overflow-hidden p-5 md:p-6">
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.3),transparent_52%)]" />
            <div class="relative">
              <div class="material-chip w-fit">Mastercard验证卡</div>
              <h3 class="mt-3 text-2xl font-semibold tracking-tight">高通过率MasterCard验证卡</h3>
              <p class="mt-3 max-w-[62ch] text-sm leading-7 text-muted-foreground">
                卡号与姓名均为演示内容，仅用于宣传效果。
              </p>
            </div>

            <div class="mastercard-demo relative mx-auto mt-5">
              <div class="card-gloss pointer-events-none" />
              <div class="card-hdr pointer-events-none" />

              <div class="relative z-10 flex h-full flex-col justify-between">
                <div class="flex items-start justify-between">
                  <div class="text-xs uppercase tracking-[0.2em] text-white/75">Mastercard</div>
                  <ShieldCheck :size="16" class="text-white/80" />
                </div>

                <div class="space-y-3">
                  <div class="h-8 w-12 rounded-md border border-white/35 bg-white/20 backdrop-blur-sm" />
                  <div class="text-[clamp(1rem,2.2vw,1.4rem)] font-semibold tracking-[0.22em] text-white">
                    5376 84•• •••• 7391
                  </div>
                </div>

                <div class="flex items-end justify-between gap-4">
                  <div>
                    <div class="text-[10px] uppercase tracking-[0.2em] text-white/70">Card Holder</div>
                    <div class="mt-1 text-sm font-medium text-white">MEI ZHAN MEMBER</div>
                  </div>
                  <div>
                    <div class="text-[10px] uppercase tracking-[0.2em] text-white/70">Valid Thru</div>
                    <div class="mt-1 text-sm font-medium text-white">10/31</div>
                  </div>
                  <div class="flex items-center -space-x-3">
                    <span class="h-9 w-9 rounded-full bg-[#ff8f3f]/90 blur-[0.1px]" />
                    <span class="h-9 w-9 rounded-full bg-[#ffd36b]/90 mix-blend-screen" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="material-chip">自助下单</span>
              <span class="material-chip">高通过率</span>
              <span class="material-chip">自动发卡</span>
            </div>

            <Button as-child class="mt-5 h-10 rounded-lg px-4">
              <a
                href="https://shop.bmoplus.com/item/15#buy"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看 Mastercard 验证卡
                <ExternalLink :size="15" class="ml-2" />
              </a>
            </Button>
          </section>

          <div class="grid gap-4">
            <a
              href="https://shop.bmoplus.com/item/29#buy"
              target="_blank"
              rel="noopener noreferrer"
              class="section-card gemini-card group relative overflow-hidden p-5 md:p-6"
            >
              <div class="gemini-orbit gemini-orbit-one" />
              <div class="gemini-orbit gemini-orbit-two" />

              <div class="relative z-10">
                <div class="material-chip tonal w-fit">Gemini Ultra会员</div>
                <h3 class="mt-3 text-2xl font-semibold tracking-tight">Gemini Ultra 加速入口</h3>
                <p class="mt-3 text-sm leading-7 text-muted-foreground">
                  采用星轨环绕动效。悬停时轨道与高亮同时增强，做出更强的可交互记忆点。
                </p>
                <div
                  class="mt-5 inline-flex items-center gap-2 border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-foreground"
                >
                  立即跳转购买
                  <ArrowRight :size="15" />
                </div>
              </div>
            </a>

            <a
              href="https://shop.bmoplus.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="section-card group relative overflow-hidden p-5 md:p-6"
            >
              <div
                class="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(171,206,246,0.16),transparent_48%,rgba(255,255,255,0.18)_100%)]"
              />
              <div class="relative z-10">
                <div class="material-chip w-fit">
                  <Layers :size="12" />
                  ChatGPT会员订阅
                </div>
                <h3 class="mt-3 text-2xl font-semibold tracking-tight">ChatGPT 会员补给站</h3>
                <p class="mt-3 text-sm leading-7 text-muted-foreground">
                  使用清晰的订阅分区和快捷入口，适合需要快速比价与下单的用户。
                </p>

                <div class="mt-4 grid gap-2 text-sm text-foreground">
                  <div class="flex items-center justify-between border border-border/70 bg-background/80 px-3 py-2">
                    <span>订阅套餐</span>
                    <span class="font-semibold">按需选购</span>
                  </div>
                  <div class="flex items-center justify-between border border-border/70 bg-background/80 px-3 py-2">
                    <span>库存更新</span>
                    <span class="font-semibold">实时同步</span>
                  </div>
                  <div class="flex items-center justify-between border border-border/70 bg-background/80 px-3 py-2">
                    <span>跳转方式</span>
                    <span class="font-semibold">官网直达</span>
                  </div>
                </div>

                <div class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  进入 ChatGPT 订阅入口
                  <ExternalLink :size="15" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="idc" class="mt-0">
        <section class="section-card overflow-hidden p-4 md:p-6">
          <div class="space-y-2 text-center">
            <div class="material-chip tonal mx-auto w-fit">坤云IDC</div>
            <h3 class="text-2xl font-semibold tracking-tight md:text-3xl">坤云IDC 服务器推广页</h3>
            <p class="mx-auto max-w-[72ch] text-sm leading-7 text-muted-foreground">
              桌面端采用立体服务器交互演示，移动端改为信息优先的卡片结构，确保不同设备都能快速理解产品卖点。
            </p>
          </div>

          <div class="idc-scene-shell mt-6 hidden lg:block">
            <div
              class="idc-scene"
              :style="idcSceneStyle"
              @mousemove="handleIdcSceneMove"
              @mouseleave="resetIdcScene"
            >
              <div class="idc-scene-brand">坤云IDC</div>

              <div class="idc-server-3d" aria-hidden="true">
                <div class="idc-stack idc-stack-1">
                  <div class="idc-front">
                    <span v-for="slot in 5" :key="`a-${slot}`" class="idc-slot" />
                  </div>
                  <div class="idc-side" />
                  <div class="idc-top-face" />
                </div>
                <div class="idc-stack idc-stack-2">
                  <div class="idc-front">
                    <span v-for="slot in 5" :key="`b-${slot}`" class="idc-slot" />
                  </div>
                  <div class="idc-side" />
                  <div class="idc-top-face" />
                </div>
                <div class="idc-stack idc-stack-3">
                  <div class="idc-front">
                    <span v-for="slot in 5" :key="`c-${slot}`" class="idc-slot" />
                  </div>
                  <div class="idc-side" />
                  <div class="idc-top-face" />
                </div>
                <div class="idc-base-shadow" />
              </div>

              <a
                v-for="(item, index) in idcPromotions"
                :key="item.title"
                :href="idcTargetUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="idc-callout"
                :class="`idc-callout-${index + 1}`"
              >
                <div class="idc-callout-index">0{{ index + 1 }}</div>
                <div class="mt-2 flex items-start gap-2">
                  <component :is="item.icon" :size="16" class="mt-0.5 shrink-0 text-primary" />
                  <p class="text-sm font-semibold leading-6 text-foreground">
                    {{ item.title }}
                  </p>
                </div>
                <p class="mt-2 text-xs leading-6 text-muted-foreground">{{ item.summary }}</p>
              </a>
            </div>
          </div>

          <div class="mt-6 space-y-3 lg:hidden">
            <div
              class="relative overflow-hidden rounded-[var(--radius-surface)] border border-border/80 bg-gradient-to-br from-background to-secondary/35 p-4"
            >
              <div
                class="pointer-events-none absolute right-[-28px] top-[-46px] h-40 w-40 rounded-full bg-primary/15 blur-3xl"
              />
              <div class="relative">
                <div class="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Gauge :size="16" class="text-primary" />
                  坤云IDC 核心节点
                </div>
                <p class="mt-2 text-sm leading-6 text-muted-foreground">
                  移动端以信息可读性优先，保留推广内容并简化 3D 动效，确保浏览稳定。
                </p>
              </div>
            </div>

            <a
              v-for="(item, index) in idcPromotions"
              :key="`${item.title}-mobile`"
              :href="idcTargetUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-[var(--radius-surface)] border border-border/80 bg-background/80 p-4"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-secondary/65"
                >
                  <component :is="item.icon" :size="16" class="text-primary" />
                </div>
                <div>
                  <div class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    方案 0{{ index + 1 }}
                  </div>
                  <p class="mt-1 text-sm font-semibold leading-6 text-foreground">{{ item.title }}</p>
                  <p class="mt-1 text-xs leading-6 text-muted-foreground">{{ item.summary }}</p>
                </div>
              </div>
            </a>
          </div>

          <div class="mt-5 flex justify-center">
            <Button as-child class="h-10 rounded-lg px-5">
              <a :href="idcTargetUrl" target="_blank" rel="noopener noreferrer">
                访问坤云IDC官网
                <ExternalLink :size="15" class="ml-2" />
              </a>
            </Button>
          </div>
        </section>
      </TabsContent>
    </Tabs>
  </PageSection>
</template>

<style scoped>
.banner-side-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.34), transparent 42%, rgba(255, 255, 255, 0.14));
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.mastercard-demo {
  width: min(100%, 620px);
  aspect-ratio: 1.586;
  min-height: 220px;
  border-radius: calc(var(--radius-surface) + 6px);
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 245, 196, 0.4), rgba(255, 245, 196, 0)),
    linear-gradient(130deg, #1f1020 10%, #552a54 52%, #2b1f4f 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 26px 56px -32px rgba(27, 8, 28, 0.8);
}

.card-gloss {
  position: absolute;
  inset: -24% -38%;
  background: linear-gradient(122deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0) 65%);
  transform: translateX(-48%) rotate(8deg);
  animation: card-sweep 6s ease-in-out infinite;
}

.card-hdr {
  position: absolute;
  right: -26%;
  top: -58%;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 213, 154, 0.72), rgba(255, 213, 154, 0));
  filter: blur(8px);
}

.gemini-card {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.gemini-card:hover {
  transform: translateY(-4px);
}

.gemini-orbit {
  position: absolute;
  border-radius: 999px;
  border: 1px solid hsl(var(--primary) / 0.24);
  transition: opacity 0.3s ease;
}

.gemini-orbit-one {
  width: 180px;
  height: 180px;
  right: -44px;
  top: -72px;
  animation: orbit-spin 12s linear infinite;
}

.gemini-orbit-two {
  width: 120px;
  height: 120px;
  right: 28px;
  top: 12px;
  animation: orbit-spin 9s linear infinite reverse;
  opacity: 0.65;
}

.gemini-card:hover .gemini-orbit {
  opacity: 0.95;
}

.idc-scene-shell {
  perspective: 1500px;
}

.idc-scene {
  --idc-rx: -12deg;
  --idc-ry: 17deg;
  --idc-tx: 0px;
  --idc-ty: 0px;
  --idc-glow-x: 52%;
  --idc-glow-y: 28%;
  position: relative;
  min-height: 700px;
  overflow: hidden;
  border-radius: calc(var(--radius-surface) + 2px);
  border: 1px solid hsl(var(--border) / 0.8);
  background:
    linear-gradient(160deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.46) 100%);
}

.idc-scene::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--idc-glow-x) var(--idc-glow-y),
    hsl(var(--primary) / 0.22),
    transparent 45%
  );
  pointer-events: none;
}

.idc-scene::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 280px;
  background:
    linear-gradient(to top, hsl(var(--background) / 0.9), transparent),
    repeating-linear-gradient(
      to right,
      transparent 0,
      transparent 34px,
      hsl(var(--border) / 0.35) 34px,
      hsl(var(--border) / 0.35) 35px
    ),
    repeating-linear-gradient(
      to top,
      transparent 0,
      transparent 34px,
      hsl(var(--border) / 0.35) 34px,
      hsl(var(--border) / 0.35) 35px
    );
  opacity: 0.45;
  pointer-events: none;
}

.idc-scene-brand {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--card) / 0.9);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--foreground));
  z-index: 20;
}

.idc-server-3d {
  position: absolute;
  left: 50%;
  top: 52%;
  width: 230px;
  height: 392px;
  transform-style: preserve-3d;
  transform: translate3d(calc(-50% + var(--idc-tx)), calc(-50% + var(--idc-ty)), 0)
    rotateX(var(--idc-rx)) rotateY(var(--idc-ry));
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 15;
}

.idc-stack {
  position: absolute;
  left: 0;
  width: 100%;
  height: 102px;
  transform-style: preserve-3d;
}

.idc-stack-1 {
  top: 10px;
}

.idc-stack-2 {
  top: 132px;
}

.idc-stack-3 {
  top: 254px;
}

.idc-front,
.idc-side,
.idc-top-face {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(160deg, rgba(36, 22, 54, 0.95), rgba(18, 12, 30, 0.95));
}

.idc-front {
  inset: 0;
  transform: translateZ(16px);
  border-radius: 14px;
  display: grid;
  align-content: center;
  gap: 7px;
  padding: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 16px 34px -18px rgba(13, 8, 20, 0.8);
}

.idc-slot {
  display: block;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(170, 206, 246, 0.82) 0%,
    rgba(170, 206, 246, 0.35) 26%,
    rgba(255, 255, 255, 0.11) 100%
  );
}

.idc-side {
  top: 0;
  right: -22px;
  width: 22px;
  height: 100%;
  border-radius: 0 12px 12px 0;
  transform: rotateY(90deg) translateZ(219px);
  background: linear-gradient(160deg, rgba(14, 10, 20, 0.88), rgba(42, 28, 65, 0.94));
}

.idc-top-face {
  left: 0;
  top: -14px;
  width: 100%;
  height: 14px;
  transform: rotateX(90deg) translateZ(16px);
  border-radius: 12px 12px 0 0;
  background: linear-gradient(180deg, rgba(253, 253, 255, 0.34), rgba(253, 253, 255, 0.06));
}

.idc-base-shadow {
  position: absolute;
  left: 50%;
  bottom: -26px;
  width: 290px;
  height: 66px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(16, 11, 27, 0.72), rgba(16, 11, 27, 0));
  filter: blur(7px);
}

.idc-callout {
  --shift-x: 0;
  --shift-y: 0;
  position: absolute;
  width: 320px;
  border-radius: 16px;
  border: 1px solid hsl(var(--border) / 0.86);
  background: hsl(var(--card) / 0.92);
  padding: 14px 15px;
  box-shadow: 0 20px 38px -26px rgba(24, 14, 34, 0.78);
  backdrop-filter: blur(4px);
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  transform: translate3d(
    calc(var(--idc-tx) * var(--shift-x)),
    calc(var(--idc-ty) * var(--shift-y)),
    0
  );
  z-index: 18;
}

.idc-callout::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 56px;
  height: 1px;
  background: linear-gradient(90deg, hsl(var(--primary) / 0.46), hsl(var(--border) / 0.18));
}

.idc-callout-index {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid hsl(var(--border) / 0.8);
  background: hsl(var(--secondary) / 0.8);
  padding: 4px 9px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: hsl(var(--primary));
}

.idc-callout-1 {
  left: 38px;
  top: 106px;
  --shift-x: 0.36;
  --shift-y: 0.24;
}

.idc-callout-1::before {
  right: -56px;
}

.idc-callout-2 {
  right: 38px;
  top: 166px;
  --shift-x: -0.38;
  --shift-y: 0.16;
}

.idc-callout-2::before {
  left: -56px;
  transform: rotate(3deg);
}

.idc-callout-3 {
  left: 42px;
  top: 352px;
  --shift-x: 0.3;
  --shift-y: -0.22;
}

.idc-callout-3::before {
  right: -56px;
  transform: rotate(-4deg);
}

.idc-callout-4 {
  right: 38px;
  top: 430px;
  --shift-x: -0.28;
  --shift-y: -0.28;
}

.idc-callout-4::before {
  left: -56px;
}

@media (max-width: 1320px) {
  .idc-callout {
    width: 280px;
  }
}

@keyframes card-sweep {
  0% {
    transform: translateX(-52%) rotate(8deg);
  }
  50% {
    transform: translateX(18%) rotate(8deg);
  }
  100% {
    transform: translateX(-52%) rotate(8deg);
  }
}

@keyframes orbit-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
