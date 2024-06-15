import { listModels } from '@renderer/hooks/useOllama'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface Message {
  role: string
  content: string
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
export const modelListAtom = atomWithStorage<listModels[]>('modelList',[]) // Storing List of Models in Local Storage
export const settingsToggleAtom = atom<boolean>(false)
export const isOllamaInstalledAtom = atom<boolean>(false)

// User Preferences
const url = new URL('/src/assets/themes/galaxia.svg', import.meta.url).href
export const backgroundImageAtom = atom<string>(localStorage.getItem('bg')  ?? url)
export const prefModelAtom = atom<string>(localStorage.getItem('prefModel') ?? '')
export const darkModeAtom = atom<boolean>(true)
