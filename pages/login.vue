<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
    <div class="w-full max-w-sm">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
          <span class="text-3xl">🦞</span>
        </div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-1">OpenClaw Workspace</h1>
        <p class="text-sm text-zinc-500">登录以继续</p>
      </div>

      <!-- Login Form -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="admin"
            :prefix-icon="User"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.rememberMe">
            记住我
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!form.username || !form.password"
            class="w-full"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Error Message -->
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        :closable="false"
        class="mt-4"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// Define page meta to hide default layout
definePageMeta({
  layout: false,
  auth: false
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  username: 'admin',
  password: '',
  rememberMe: true
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true
    errorMessage.value = ''

    // Use custom auth endpoint
    const response = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password
      }
    })

    // Redirect to home or the page user was trying to access
    const redirect = useRoute().query.redirect as string || '/'
    await navigateTo(redirect)
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.fields) {
      // Form validation error
      return
    }
    // Handle API errors
    if (error.response?.status === 401) {
      errorMessage.value = '用户名或密码错误'
    } else {
      errorMessage.value = error.message || '登录失败，请重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  color: rgb(161 161 170);
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  background-color: rgb(39 39 42);
  border-color: rgb(63 63 70);
  box-shadow: none;
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

:deep(.el-checkbox__label) {
  color: rgb(161 161 170);
}

:deep(.el-button--primary) {
  background: linear-gradient(to bottom right, rgb(251 191 36), rgb(217 119 6));
  border: none;
  color: white;
  font-weight: 500;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(to bottom right, rgb(252 211 77), rgb(234 179 8));
  box-shadow: 0 10px 15px -3px rgb(251 191 36 / 0.2);
}

:deep(.el-button--primary:disabled) {
  opacity: 0.5;
}

:deep(.el-alert--error) {
  background-color: rgb(79 20 20);
  border-color: rgb(185 28 28);
}

:deep(.el-alert--error .el-alert__title) {
  color: rgb(254 226 226);
}

:deep(.el-alert--error .el-alert__icon) {
  color: rgb(248 113 113);
}
</style>
