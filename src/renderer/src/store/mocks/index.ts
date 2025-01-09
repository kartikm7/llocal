import { listModels } from '@renderer/hooks/useOllama'
import { atom } from 'jotai'
// import { atomWithStorage } from 'jotai/utils'

export interface Message {
  role: string
  content: string
}

export interface fileContext {
  path: string,
  fileName: string
}

interface getVectorDb {
  path: string,
  fileName: string
}

interface suggestions {
  show: boolean,
  prompts: string[]
}


export const messages = [
  {
    role: 'user',
    content: 'why is the sky blue?'
  },
  {
    role: 'assistant',
    content: 'due to rayleigh scattering.'
  },
  {
    role: 'user',
    content: 'how is that different than mie scattering?'
  }
]

export const chatAtom = atom<Message[]>([]) // Current Chat
export const selectedChatIndexAtom = atom<string>('') // Selected Chat
export const streamingAtom = atom<string>('') // Handling Streaming
export const stopGeneratingAtom = atom<boolean>(false) // Handling the option to stop generating
export const imageAttatchmentAtom = atom<string>('') // Storing the base64 image
export const experimentalSearchAtom = atom<boolean>(false) // Toggle for websearch
export const fileContextAtom = atom<fileContext[]>([]) // For storing the current file for RAG
export const knowledgeBaseAtom = atom<getVectorDb[]>([]) // For storing the list of vector db's
export const modelListAtom = atom<listModels[]>(JSON.parse(localStorage.getItem('modelList') || '[]') as listModels[]) // Storing List of Models in Local Storage
export const settingsToggleAtom = atom<boolean>(false)
export const isOllamaInstalledAtom = atom<boolean>(false)
export const suggestionsAtom = atom<suggestions>({ show: JSON.parse(localStorage.getItem('showSuggestions') || 'false'), prompts: [] })

// User Preferences
const url = new URL('/src/assets/themes/galaxia.svg', import.meta.url).href
export const backgroundImageAtom = atom<string>(localStorage.getItem('bg') ?? url)
export const prefModelAtom = atom<string>(localStorage.getItem('prefModel') ?? '')
export const darkModeAtom = atom<boolean>(true)
export const transparencyModeAtom = atom<boolean>(String(localStorage.getItem('transparencyMode')) === 'true')
