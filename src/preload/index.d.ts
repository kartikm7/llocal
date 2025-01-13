import { ElectronAPI } from '@electron-toolkit/preload'

interface duckduckgoSearchType {
  prompt: string
  sources: string
}

interface addKnowledgeType {
  // status: boolean
  path: string
  fileName: string
}

interface ragReturn {
  prompt: string
  sources: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      checkingOllama: () => Promise<boolean>,
      checkingBinaries: () => Promise<boolean>,
      checkingBinarySize: () => Promise<boolean>,
      downloadingOllama: () => Promise<string>,
      installingOllama: () => Promise<boolean>,
      checkVersion: () => Promise<string>,
      checkPlatform: () => Promise<string>,
      experimentalSearch: (searchQuery: string, links: string[]) => Promise<duckduckgoSearchType>,
      addKnowledge: () => Promise<addKnowledgeType>,
      similaritySearch: (selectedKnowledge: addKnowledgeType[], prompt: string) => Promise<ragReturn>,
      getVectorDbList: () => Promise<addKnowledgeType[]>,
      deleteVectorDb: (indexPath: string) => Promise<boolean>,
      titleBar: (event: string) => void
    }
  }
}
