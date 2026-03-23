<!-- components/base/AppInput.vue -->
<template>
  <div class="app-input">
    <label v-if="label" class="app-input-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="app-input-wrapper">
      <AppIcon v-if="prefixIcon" :name="prefixIcon" size="sm" class="app-input-icon app-input-icon-left" />
      <input
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input-field"
        :class="{ 'app-input-field-with-icon': prefixIcon || suffixIcon }"
      />
      <AppIcon v-if="suffixIcon" :name="suffixIcon" size="sm" class="app-input-icon app-input-icon-right" />
    </div>
    <p v-if="error" class="app-input-error">{{ error }}</p>
    <p v-if="hint && !error" class="app-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String as PropType<'text' | 'password' | 'email' | 'number'>,
    default: 'text'
  },
  label: String,
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  prefixIcon: String,
  suffixIcon: String
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.app-input-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: #f1f5f9;
}

.app-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-input-field {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  color: #f1f5f9;
  font-size: var(--text-sm);
  transition: all 0.15s ease-out;
}

.app-input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.app-input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-input-field::placeholder {
  color: rgba(241, 245, 249, 0.4);
}

.app-input-field-with-icon {
  padding-left: 2.5rem;
}

.app-input-field-with-icon:last-child {
  padding-right: 2.5rem;
}

.app-input-icon {
  position: absolute;
  color: rgba(241, 245, 249, 0.5);
  pointer-events: none;
}

.app-input-icon-left {
  left: 0.75rem;
}

.app-input-icon-right {
  right: 0.75rem;
}

.app-input-error {
  font-size: var(--text-xs);
  color: #ef4444;
}

.app-input-hint {
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.5);
}
</style>
