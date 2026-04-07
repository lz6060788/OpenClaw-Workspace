<!-- components/settings/PasswordChange.vue -->
<template>
  <div class="bg-zinc-800/50 border border-white/5 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-4">
      <Icon name="lock" size="md" icon-color="rgb(161 161 170)" />
      <div>
        <h3 class="text-base font-semibold text-zinc-100">修改密码</h3>
        <p class="text-xs text-zinc-500">更改您的登录密码</p>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleChangePassword"
    >
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input
          v-model="form.currentPassword"
          type="password"
          placeholder="请输入当前密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新密码（至少 8 位）"
          show-password
          @input="checkPasswordStrength"
        />
        <div v-if="form.newPassword" class="mt-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: passwordStrengthPercentage + '%' }"
              />
            </div>
            <span class="text-xs" :class="passwordStrengthTextColor">
              {{ passwordStrengthText }}
            </span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleChangePassword"
        >
          {{ loading ? '保存中...' : '保存密码' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import Icon from '~/components/Icon.vue'

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordStrength = ref(0)
const passwordStrengthText = computed(() => {
  if (passwordStrength.value === 0) return ''
  if (passwordStrength.value <= 1) return '弱'
  if (passwordStrength.value <= 2) return '中等'
  if (passwordStrength.value <= 3) return '强'
  return '非常强'
})

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value / 4) * 100
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-500'
  if (passwordStrength.value <= 2) return 'bg-yellow-500'
  if (passwordStrength.value <= 3) return 'bg-green-500'
  return 'bg-emerald-500'
})

const passwordStrengthTextColor = computed(() => {
  if (passwordStrength.value <= 1) return 'text-red-500'
  if (passwordStrength.value <= 2) return 'text-yellow-500'
  if (passwordStrength.value <= 3) return 'text-green-500'
  return 'text-emerald-500'
})

const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码至少 8 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const checkPasswordStrength = () => {
  const password = form.newPassword
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  passwordStrength.value = Math.min(strength, 4)
}

const handleChangePassword = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (passwordStrength.value < 2) {
      ElMessage.warning('新密码强度太弱，请使用更强的密码')
      return
    }

    loading.value = true

    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }
    })

    ElMessage.success('密码修改成功，请重新登录')

    // Reset form
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    passwordStrength.value = 0

    // Logout and redirect to login
    setTimeout(async () => {
      const { signOut } = useAuthState()
      await signOut()
      await navigateTo('/login')
    }, 1500)
  } catch (error: any) {
    console.error('Change password error:', error)
    ElMessage.error(error.data?.statusMessage || error.message || '密码修改失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  color: rgb(161 161 170);
}

:deep(.el-input__wrapper) {
  background-color: rgb(39 39 42);
  border-color: rgb(63 63 70);
}

:deep(.el-input__wrapper:hover) {
  border-color: rgb(82 82 91);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: rgb(251 191 36);
}

:deep(.el-input__inner) {
  color: rgb(228 228 231);
}

:deep(.el-input__inner::placeholder) {
  color: rgb(113 113 122);
}
</style>
