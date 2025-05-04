import { db } from '@renderer/utils/db'
import { Message, selectedChatIndexAtom } from '../store/mocks'
import { useAtom } from 'jotai'
import { toast } from 'sonner';
import { t } from '@renderer/utils/utils';

export interface getDbReturn {
  date: string;
  chat: Message[];
}

type useDbReturn = {
  addChat: (messages: Message[]) => Promise<string>
  getMessageList: () => Promise<getDbReturn[]>
  getChat: () => Promise<Message[]>
  updateDate: (date: string) => Promise<string>
  deleteChat: (date: string) => Promise<void>
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
    const response: getDbReturn = await db.collection('chat').doc({ date: selectedChatIndex }).get()
    return response.chat
  }

  const deleteChat = async (date: string): Promise<void> => {
    try {
      await db.collection('chat').doc({ date: date }).delete()
      setSelectedChatIndex("") // this is incredibly important, because chat/chatlist state updates happen based on selectedChatIndex
      toast.success(t('The chat has been deleted'))
    } catch (error) {
      toast.error(t(`The chat could not be deleted due to the following error`) + `\n ${error}`)
    }
  }

  const getMessageList = async (): Promise<getDbReturn[]> => {
    const response = await db.collection('chat').orderBy('date').get()
    // console.log(response);
    return response.reverse()
  }

  const updateDate = async (date: string): Promise<string> => {
    const currentDate = new Date()
    const isoDateString = currentDate.toISOString()
    const response: getDbReturn = await db.collection('chat').doc({ date: date }).set({ date: isoDateString })
    return response.date
  }

  return { addChat, getMessageList, getChat, updateDate, deleteChat }
}
