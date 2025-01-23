<template>
  <div>
    <FormattedInputNumber v-model="inputValue" />
    <p>当前值：{{ inputValue }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import FormattedInputNumber from '@/components/form/formItems/formItemInputNumber.vue'

const inputValue = ref<number | undefined>(undefined)
</script>
