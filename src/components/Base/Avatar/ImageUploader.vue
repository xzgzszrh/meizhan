<script setup>
import { ref } from 'vue'
import axios from 'redaxios'
import { useLogto } from '@logto/vue'
import { ImageUp, Loader2, Save, Trash2, Undo2 } from 'lucide-vue-next'
import { eventBus } from '@/lib/eventBus.js'
import { toast } from 'vue-sonner'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card/index.js'
import { Button } from '@/components/ui/button/index.js'
import { createReusableTemplate, useDropZone, useMediaQuery } from '@vueuse/core'
import { DrawerFooter } from '@/components/ui/drawer/index.js'
import { API } from '@/lib/apiRouteMap.js'

const { getAccessToken } = useLogto()
const fileInput = ref(null)
const preview = ref(null)
const dropZone = ref()
let selectedFile = ref(null)

const isLoading = defineModel(false)

const openFileDialog = () => {
  fileInput.value.click()
}

const prepareFile = () => {
  const files = fileInput.value.files
  if (files.length > 0) {
    selectedFile.value = files[0]
    preview.value = URL.createObjectURL(files[0])
  }
}

const uploadFile = async () => {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.set('file', selectedFile.value, `image.${selectedFile.value.name.split('.').pop()}`)
  try {
    const response = await axios.post(API.AVATAR.UPLOAD, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (response.status === 204) {
      toast.success('头像已更新', { description: '上传的图片已经应用到你的账户。' })
      preview.value = null
      selectedFile.value = null
      eventBus.emit('refreshUserData', true)
    }
  } catch (error) {
    console.log('Error uploading file:', error)
    if (error.status === 406) {
      toast.warning('图片不符合要求', {
        description: '请更换一张清晰、合适的头像图片后重试。'
      })
      preview.value = null
      selectedFile.value = null
    } else {
      toast.error('上传失败', { description: '服务暂时不可用，请稍后重试。' })
    }
  } finally {
    isLoading.value = false
  }
}

const clearPreview = () => {
  preview.value = null
  selectedFile.value = null
  fileInput.value.value = ''
}

defineExpose({
  prepareFile
})

function onImageDrop(files) {
  fileInput.value.droppedFiles = files[0]
  if (files.length > 0) {
    selectedFile.value = files[0]
    preview.value = URL.createObjectURL(files[0])
  }
}

const { isOverDropZone } = useDropZone(dropZone, {
  onDrop: onImageDrop,
  dataTypes: ['image/jpeg', 'image/png']
})

const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseFooterTemplate>
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px]">
        <Undo2 class="w-4 h-4 mr-2" />
        取消
      </Button>
    </DialogClose>
    <Button @click="uploadFile" class="desktop:h-[30px]" :disabled="!selectedFile || isLoading">
      <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin text-current" />
      <Save v-else class="w-4 h-4 mr-2" />
      {{ isLoading ? '处理中...' : '保存头像' }}
    </Button>
  </UseFooterTemplate>

  <Card>
    <CardHeader>
      <CardTitle class="tablet:text-lg">上传自定义头像</CardTitle>
      <CardDescription> 支持 PNG、JPG 格式，可拖拽上传或点击选择文件。 </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <div
        ref="dropZone"
        @click="openFileDialog"
        class="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-foreground/40 tablet:h-36"
        :class="{ 'border-foreground/40': isOverDropZone }"
      >
        <div
          v-if="preview"
          class="w-full h-64 flex justify-center items-center overflow-hidden rounded-lg py-4"
        >
          <img :src="preview" class="max-w-[150px]" alt="头像预览" />
          <button
            class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
            @click.stop="clearPreview"
          >
            <Trash2 />
          </button>
        </div>
        <label
          v-else
          class="flex justify-center items-center"
          :class="isLoading ? 'cursor-not-allowed' : 'cursor-pointer'"
        >
          <ImageUp class="text-muted-foreground" />
          <span class="ml-1 text-base leading-normal text-muted-foreground">选择或拖拽图片</span>
        </label>
        <input
          type="file"
          class="hidden"
          ref="fileInput"
          name="file"
          @change="prepareFile"
          accept=".png, .jpeg, .jpg"
        />
      </div>
    </CardContent>
    <CardFooter>
      <p class="text-xs font-bold">最大上传大小 8000KB（8MB）</p>
    </CardFooter>
  </Card>
  <DrawerFooter v-if="!isDesktop" class="w-full px-0">
    <FooterTemplate />
  </DrawerFooter>
  <DialogFooter v-else class="right-0">
    <FooterTemplate />
  </DialogFooter>
</template>
