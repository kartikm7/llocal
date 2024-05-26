import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      checkingOllama: ()=>Promise<boolean>,
      checkingBinaries: ()=>Promise<boolean>,
      downloadingOllama: ()=>Promise<string>,
      installingOllama: ()=>Promise<boolean>,
    }
  }
}
