// plugins/monaco-editor.client.ts
import MonacoEditor from 'monaco-editor-vue3'
import * as monaco from 'monaco-editor'

export default defineNuxtPlugin((nuxtApp) => {
  // 配置 Monaco Editor Worker
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: string, label: string) {
      // 使用 CDN 的 worker 文件
      if (label === 'json') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/json/json.worker.js'
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/css/css.worker.js'
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/html/html.worker.js'
      }
      if (label === 'typescript' || label === 'javascript') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/typescript/ts.worker.js'
      }
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.worker.js'
    }
  }

  nuxtApp.vueApp.component('MonacoEditor', MonacoEditor)
})
