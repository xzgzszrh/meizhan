<script setup>
import { ref } from 'vue'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog/index.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/index.js'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button/index.js'
import AvatarGallery from '@/components/Base/Avatar/AvatarGallery.vue'
import ImageUploader from '@/components/Base/Avatar/ImageUploader.vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { ImagePlus } from 'lucide-vue-next'

const isLoading = ref(false)
const isDesktop = useMediaQuery('(min-width: 1023px)')
const [UseDisclaimerText, DisclaimerText] = createReusableTemplate()
</script>

<template>
  <UseDisclaimerText>
    请仅上传你拥有使用权或已获得授权的图片。头像会与账户资料关联，并可能在其他用户可见的
    账户界面中展示。
  </UseDisclaimerText>
  <DialogHeader class="tablet:my-5">
    <DialogTitle class="flex items-center gap-2 text-2xl tablet:flex-col tablet:text-center">
      <ImagePlus :size="32" />
      编辑头像
    </DialogTitle>
    <DialogDescription v-if="isDesktop" class="text-xs">
      <DisclaimerText />
    </DialogDescription>
    <Popover v-else>
      <PopoverTrigger as-child>
        <Button variant="link" size="xs" class="text-sm dark:text-primary"> 使用说明 </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DisclaimerText />
      </PopoverContent>
    </Popover>
  </DialogHeader>
  <Tabs default-value="upload" class="h-full w-full">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="upload" :disabled="isLoading">上传图片</TabsTrigger>
      <TabsTrigger value="gallery" :disabled="isLoading">系统头像库</TabsTrigger>
    </TabsList>
    <TabsContent value="upload" force-mount>
      <ImageUploader v-model="isLoading" />
    </TabsContent>
    <TabsContent value="gallery">
      <AvatarGallery v-model="isLoading" />
    </TabsContent>
  </Tabs>
</template>
