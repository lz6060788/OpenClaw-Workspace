// stores/app.ts
import { defineStore } from 'pinia'

export type ModuleType = 'dev' | 'docs'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentModule: 'dev' as ModuleType,
  }),
  actions: {
    setModule(module: ModuleType) {
      this.currentModule = module
    },
  },
})
