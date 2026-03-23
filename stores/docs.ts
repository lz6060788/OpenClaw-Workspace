// stores/docs.ts
import { defineStore } from 'pinia'

export const useDocsStore = defineStore('docs', {
  state: () => ({
    currentDoc: '' as string,
    docContent: '' as string,
    originalContent: '' as string,
    configFiles: ['AGENTS.md', 'SOUL.md', 'USER.md', 'TOOLS.md', 'IDENTITY.md', 'HEARTBEAT.md'],
    skills: [] as string[],
    memoryFiles: [] as string[],
  }),
  actions: {
    setCurrentDoc(doc: string) {
      this.currentDoc = doc
    },
    setDocContent(content: string) {
      this.docContent = content
      this.originalContent = content
    },
    setSkills(skills: string[]) {
      this.skills = skills
    },
    setMemoryFiles(files: string[]) {
      this.memoryFiles = files
    },
  },
})
