<template>
  <a-modal
    v-model:visible="isVisible"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot></slot>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue'

// 定义props
const props = defineProps<{
  isVisible: boolean // 注意这里用modelValue对应v-model
  title?: string
}>()

// 定义emit
const emit = defineEmits<{
  'update:isVisible': [value: boolean]
  ok: []
  cancel: []
}>()

// 使用computed处理visible的双向绑定
const isVisible = computed({
  get() {
    return props.isVisible
  },
  set(val: boolean) {
    emit('update:isVisible', val)
  }
})

// 处理事件
const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  console.log(emit)
  emit('cancel')
}
</script>
