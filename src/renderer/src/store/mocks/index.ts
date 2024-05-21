import { atom } from 'jotai'

export interface Message {
  role: string;
  content: string;
}

export const messages =
  [
    {
      "role": "user",
      "content": "why is the sky blue?"
    },
    {
      "role": "assistant",
      "content": "due to rayleigh scattering."
    },
    {
      "role": "user",
      "content": "how is that different than mie scattering?"
    }
  ]

export const chatAtom = atom<Message[]>([]) // Current Chat
export const selectedChatIndexAtom = atom<string>(""); // Selected Chat
export const streamingAtom = atom<string>('') // Handling Streaming
export const settingsToggleAtom = atom<boolean>(false)

// User Preferences 
export const backgroundImageAtom = atom<string>(localStorage.getItem('bg') ?? '/src/assets/themes/galaxia.svg')
export const prefModelAtom = atom<string>(localStorage.getItem('prefModel')??'')

export const darkModeAtom = atom<boolean>(true);