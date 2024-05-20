import { db } from '@renderer/utils/db'
import { Message, selectedChatIndexAtom } from '../store/mocks'
import { useAtom } from 'jotai'

export interface getDbReturn {
  date: string;
  chat: Message[];
}

type useDbReturn = {
  addChat: (messages: Message[]) => Promise<string>
  getMessageList: () => Promise<getDbReturn[]>
  getChat: () => Promise<Message[]>
  updateDate: (date:string) => Promise<string>
}

export function useDb(): useDbReturn {
  const [selectedChatIndex, setSelectedChatIndex] = useAtom(selectedChatIndexAtom)
  const addChat = async (messages: Message[]): Promise<string> => {
    try {
      const response = await db
        .collection('chat')
        .doc({ date: selectedChatIndex })
        .set({
          date: selectedChatIndex,
          chat: messages
        })
        .then((chat) => console.log('AddChat: ', chat))
      return response
    } catch (error) {
      const currentDate = new Date()
      const isoDateString = currentDate.toISOString()
      const response = await db
        .collection('chat')
        .add({
          date: isoDateString,
          chat: messages
        })
        .then((chat) => console.log('AddChat: ', chat))
      setSelectedChatIndex(isoDateString)
      return response
    }
  }

  const getChat = async (): Promise<Message[]> => {
    const response:getDbReturn = await db.collection('chat').doc({ date: selectedChatIndex }).get()
    return response.chat
  }

  const getMessageList = async (): Promise<getDbReturn[]> => {
    const response = await db.collection('chat').orderBy('date').get()
    console.log(response);
    
    return response
  }

  const updateDate = async (date:string): Promise<string> => {
    const currentDate = new Date()
    const isoDateString = currentDate.toISOString()
    const response:getDbReturn = await db.collection('chat').doc({date: date}).set({date: isoDateString})
    return response.date
  }

  return { addChat, getMessageList, getChat, updateDate }
}
