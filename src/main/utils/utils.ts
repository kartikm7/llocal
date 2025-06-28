import os from 'os'
import path from 'path'
import { downloadDirectory } from '..'
export const delay = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// check os and resolve directory, this makes llocal os agnostic hopefully
export function createPath(target: string, basePath = ""): string {
  const operatingSystem = os.platform()
  switch (operatingSystem) {
    case 'darwin':
      if (!basePath) return path.join(downloadDirectory, 'LLocal', target)
      return path.join(basePath, target)
    case 'win32':
      if (!basePath) return path.join(os.homedir(), 'AppData', 'Roaming', 'LLocal', target)
      return path.join(basePath, target)
    default:
      if (!basePath) return path.join(downloadDirectory, 'LLocal', target)
      return path.join(basePath, target)
  }
}
