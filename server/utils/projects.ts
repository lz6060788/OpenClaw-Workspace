import { join } from 'path'
import { db } from '~/server/utils/db'

// Get GitHub projects path from database
export async function getProjectsDir() {
  const pathSetting = await db.setting.findByKey('GITHUB_PROJECTS_PATH')
  return pathSetting?.value || join(process.cwd(), 'github-projects')
}
