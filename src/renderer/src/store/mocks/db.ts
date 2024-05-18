import Localbase from 'localbase'
import { Message } from '.'
export const db = new Localbase('db')

export const updateChat = (messages:Message[]): void => {
  db.collection('chat').add({
    chat: messages
  })
}