// components/OrderForm.vue

<template>
  <a-form
    :model="formData"
    :rules="rules"
    ref="formRef"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
  >
    <a-form-item label="标题" name="title">
      <a-input
        v-model:value="formData.title"
        placeholder="请输入标题"
        :maxLength="50"
        show-count
      />
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formData.status" placeholder="请选择状态">
        <a-select-option value="active">激活</a-select-option>
        <a-select-option value="inactive">未激活</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="提交时间" name="submittedAt">
      <a-date-picker
        v-model:value="formData.submittedAt"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="描述" name="description">
      <a-textarea
        v-model:value="formData.description"
        placeholder="请输入描述信息"
        :rows="4"
        :maxLength="200"
        show-count
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { BaseOrder } from '../types'
import { formRules } from '../types'

interface Props {
  initialData?: Partial<BaseOrder>
  autoSave?: boolean
}

interface Emits {
  (e: 'save', data: BaseOrder): void
  (e: 'auto-save', data: BaseOrder): void
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  autoSave: false
})

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<BaseOrder>({
  id: props.initialData?.id || null,
  title: props.initialData?.title || '',
  status: props.initialData?.status || 'inactive',
  submittedAt: props.initialData?.submittedAt || null,
  description: props.initialData?.description || ''
})

// 自动保存
let autoSaveTimeout: NodeJS.Timeout | null = null
watch(
  () => ({ ...formData }),
  newValue => {
    if (!props.autoSave) return

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }

    autoSaveTimeout = setTimeout(() => {
      emit('auto-save', newValue)
    }, 3000)
  },
  { deep: true }
)

// 验证并获取表单数据
const validate = async () => {
  await formRef.value?.validate()
  return { ...formData }
}

// 重置表单
const reset = () => {
  formRef.value?.resetFields()
}

// 暴露方法给父组件
defineExpose({
  validate,
  reset,
  formData
})
</script>
