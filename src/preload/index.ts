import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

interface duckduckgoSearchType {
  prompt: string
  sources: string
}

// Custom APIs for renderer
const api = {
  checkingOllama:():Promise<boolean>=> ipcRenderer.invoke('checkingOllama'),
  checkingBinaries:():Promise<boolean>=> ipcRenderer.invoke('checkingBinaries'),
  downloadingOllama:():Promise<string>=> ipcRenderer.invoke('downloadingOllama'),
  installingOllama:():Promise<boolean>=> ipcRenderer.invoke('installingOllama'),
  checkVersion:():Promise<string>=> ipcRenderer.invoke('checkVersion'),
  experimentalSearch:(searchQuery:string, links:string[]):Promise<duckduckgoSearchType>=> ipcRenderer.invoke('experimentalSearch', searchQuery, links),
  addKnowledge:():Promise<addKnowledgeType>=> ipcRenderer.invoke('addKnowledge'),
  similaritySearch:(indexPath:string, prompt:string):Promise<ragReturn>=> ipcRenderer.invoke('similaritySearch',indexPath, prompt),
  getVectorDbList:():Promise<addKnowledgeType[]>=> ipcRenderer.invoke('getVectorDbList'),
}




// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if(!process.contextIsolated){
  throw new Error('contextIsolation must be enabled in the browserwindow')
}
try {
    // this does not work for some reason
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }