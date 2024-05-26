import { atom } from 'jotai'

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
export const settingsToggleAtom = atom<boolean>(false)
export const isOllamaInstalledAtom = atom<boolean>(localStorage.getItem('isInstalled') == 'true' ?? false)

// User Preferences
const url = new URL('/src/assets/themes/galaxia.svg', import.meta.url).href
export const backgroundImageAtom = atom<string>(localStorage.getItem('bg')  ?? url)
export const prefModelAtom = atom<string>(localStorage.getItem('prefModel') ?? '')
export const darkModeAtom = atom<boolean>(true)
