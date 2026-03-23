// stores/project.ts
import { defineStore } from 'pinia'

export interface Project {
  name: string
  path: string
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    files: [] as any[],
    currentFile: null as string | null,
    fileContent: '',
  }),
  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects
    },
    setCurrentProject(project: Project | null) {
      this.currentProject = project
      // 切换项目时清空文件相关状态
      this.currentFile = null
      this.fileContent = ''
      this.files = []
    },
    setFiles(files: any[]) {
      this.files = files
    },
    setCurrentFile(file: string | null) {
      this.currentFile = file
    },
    setFileContent(content: string) {
      this.fileContent = content
    },
  },
})
