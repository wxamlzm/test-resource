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

// 声明组件接收的属性，及对应属性的类型契约，返回值是——
const props = defineProps<{
  isVisible: boolean // 注意这里用modelValue对应v-model
  title?: string
}>()

// 声明允许emit的函数，及对应函数的类型，并返回一个函数
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
