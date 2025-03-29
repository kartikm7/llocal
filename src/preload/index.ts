import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

interface webSearchType {
  prompt: string
  sources: string
}

// Custom APIs for renderer
const api = {
  checkingOllama: (): Promise<boolean> => ipcRenderer.invoke('checkingOllama'),
  checkingBinaries: (): Promise<boolean> => ipcRenderer.invoke('checkingBinaries'),
  checkingBinarySize: (): Promise<boolean> => ipcRenderer.invoke('checkingBinarySize'),
  downloadingOllama: (): Promise<string> => ipcRenderer.invoke('downloadingOllama'),
  installingOllama: (): Promise<boolean> => ipcRenderer.invoke('installingOllama'),
  checkVersion: (): Promise<string> => ipcRenderer.invoke('checkVersion'),
  checkPlatform: (): Promise<string> => ipcRenderer.invoke('checkPlatform'),
  experimentalSearch: (searchQuery: string, links: string[]): Promise<webSearchType> => ipcRenderer.invoke('experimentalSearch', searchQuery, links),
  addKnowledge: (): Promise<addKnowledgeType> => ipcRenderer.invoke('addKnowledge'),
  similaritySearch: (chosenVectorDbsPath: addKnowledgeType[], prompt: string): Promise<ragReturn> => ipcRenderer.invoke('similaritySearch', chosenVectorDbsPath, prompt),
  getVectorDbList: (): Promise<addKnowledgeType[]> => ipcRenderer.invoke('getVectorDbList'),
  deleteVectorDb: (indexPath: string): Promise<boolean> => ipcRenderer.invoke('deleteVectorDb', indexPath),
  titleBar: (event: string): void => ipcRenderer.send('titleBar', event)
}




// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the browserwindow')
}
try {
  // this does not work for some reason
  // contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
