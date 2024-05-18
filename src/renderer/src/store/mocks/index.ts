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

export const chatAtom = atom<Message[]>(messages) // Current Chat
export const selectedChatIndexAtom = atom<number>(-1); // Selected Chat


// Important fundamental states
export const modelNameAtom =  atom<string>('phi3');