// stores/project.ts
import { defineStore } from 'pinia'

export interface Project {
  id: number
  name: string
  full_name: string
  owner: string
  description: string | null
  default_branch: string
  branches: string[]
  private: boolean
  localExists: boolean
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
