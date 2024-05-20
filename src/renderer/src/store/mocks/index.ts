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

// Important fundamental states
export const modelNameAtom =  atom<string>('tinyllama');