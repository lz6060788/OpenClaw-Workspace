// stores/docs.ts
import { defineStore } from 'pinia'

export const useDocsStore = defineStore('docs', {
  state: () => ({
    currentDoc: '' as string,
    docContent: '' as string,
    originalContent: '' as string,
    configFiles: [] as string[],
    skills: [] as string[],
    memoryFiles: [] as string[],
    selectedAgent: '' as string,
    agentList: [] as { id: string, workspace: string }[],
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
    setConfigFiles(files: string[]) {
      this.configFiles = files
    },
    setSelectedAgent(agentId: string) {
      this.selectedAgent = agentId
    },
    setAgentList(list: { id: string, workspace: string }[]) {
      this.agentList = list
    },
  },
})
