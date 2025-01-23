<template>
  <div class="input-number-wrapper" style="width: 100%">
    <a-input-number
      :value="modelValue === null ? undefined : modelValue"
      @update:value="handleInput"
      :formatter="formatter"
      :parser="parser"
      @keydown="handleKeyDown"
      :min="0"
      style="width: 100%"
    />
    <a-button
      v-if="modelValue !== null && modelValue !== undefined"
      class="clear-button"
      type="text"
      @click="handleClear"
    >
      <template #icon>
        <close-circle-outlined />
      </template>
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { CloseCircleOutlined } from '@ant-design/icons-vue'

// 定义 props 和 emit
const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// 正则表达式常量
const COMMA_FORMAT_REGEX = /\B(?=(\d{3})+(?!\d))/g // 千分位格式化正则

// 允许的按键列表
const ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  '.' // 允许小数点
]

// 允许的组合键列表（仅在 Ctrl 或 Cmd 按下时允许）
const ALLOWED_COMBINATION_KEYS = ['a', 'c', 'v', 'x', 'z']

// 千分位格式化函数（仅对整数部分）
const formatNumberWithCommas = (value: string): string => {
  // 分离整数部分和小数部分
  const [integerPart, decimalPart] = value.split('.')

  // 对整数部分进行千分位格式化
  const formattedInteger = integerPart.replace(COMMA_FORMAT_REGEX, ',')

  // 组合整数部分和小数部分
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

// formatter：格式化显示的值
const formatter = (value: string | number | undefined): string => {

  if (value === undefined || value === null) return ''
  const stringValue = value.toString()
  console.log(111)
  // 直接对整数部分进行千分位格式化
  return formatNumberWithCommas(stringValue)
}

// parser：解析用户输入的值
const parser = (value: string | undefined): string => {
  if (!value) return ''
  // 去除千分位逗号，保留小数部分
  return value.replace(/,/g, '')
}

// 处理输入事件
const handleInput = (value: number | undefined) => {
  // 将更新后的值传递给父组件
  emit('update:modelValue', value === undefined ? null : value)
}

// 处理键盘按下事件
const handleKeyDown = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  const cursorPosition = input.selectionStart // 获取光标位置

  // 允许的按键检查
  const isAllowedKey =
    ALLOWED_KEYS.includes(event.key) || // 允许的单个按键
    ((event.ctrlKey || event.metaKey) &&
      ALLOWED_COMBINATION_KEYS.includes(event.key.toLowerCase())) || // 允许的组合键
    /^\d$/.test(event.key) // 允许数字键

  // 如果按键不被允许，阻止默认行为
  if (!isAllowedKey) {
    event.preventDefault()
    return
  }

  // 获取当前输入框的值（去除千分位逗号）
  const currentValue = value.replace(/,/g, '')

  // 分离整数部分和小数部分
  const [integerPart, decimalPart] = currentValue.split('.')

  // 如果当前值已经包含小数点
  if (value.includes('.')) {
    const decimalIndex = value.indexOf('.')
    if (cursorPosition !== null && cursorPosition > decimalIndex) {
      // 如果光标在小数点后，且小数点后已经有两位，阻止输入（除了允许的按键）
      if (decimalPart?.length >= 2) {
        const isAllowedKeyAfterDecimal =
          ALLOWED_KEYS.includes(event.key) || // 允许的单个按键
          ((event.ctrlKey || event.metaKey) &&
            ALLOWED_COMBINATION_KEYS.includes(event.key.toLowerCase())) // 允许的组合键

        if (!isAllowedKeyAfterDecimal) {
          event.preventDefault()
        }
      }
    } else {
      // 如果光标在小数点前，且整数部分已经达到 12 位，阻止输入数字（允许小数点）
      if (integerPart.length >= 12 && /^\d$/.test(event.key)) {
        event.preventDefault()
      }
    }
  } else {
    // 如果当前值不包含小数点，且整数部分已经达到 12 位，阻止输入数字（允许小数点）
    if (integerPart.length >= 12 && /^\d$/.test(event.key)) {
      event.preventDefault()
    }
  }
}

// 处理清空按钮点击事件
const handleClear = () => {
  emit('update:modelValue', null)
}
</script>

<style scoped>
.input-number-wrapper {
  position: relative;
  display: inline-block;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.clear-button:hover {
  opacity: 1;
}
</style>
