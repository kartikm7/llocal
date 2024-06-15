import { ElectronAPI } from '@electron-toolkit/preload'

interface duckduckgoSearchType {
  prompt: string
  sources: string
}


declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      checkingOllama: ()=>Promise<boolean>,
      checkingBinaries: ()=>Promise<boolean>,
      downloadingOllama: ()=>Promise<string>,
      installingOllama: ()=>Promise<boolean>,
      checkVersion: ()=>Promise<string>,
      experimentalSearch: (searchQuery: string)=>Promise<duckduckgoSearchType>,
    }
  }
}
