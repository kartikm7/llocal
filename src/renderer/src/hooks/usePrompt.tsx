import { chatAtom, prefModelAtom, streamingAtom } from '@renderer/store/mocks'
import { ollama } from '@renderer/utils/ollama'
// import axios from 'axios'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useDb } from './useDb'

export function usePrompt(): [boolean, (prompt: string) => Promise<void>] {
  const [isLoading, setLoading] = useState(false)
  const [chat, setChat] = useAtom(chatAtom)
  const [modelName] = useAtom(prefModelAtom)
  const setStream = useSetAtom(streamingAtom)
  const {addChat} = useDb()
  // To Debug
  // useEffect(()=>{console.log(stream);
  // },[stream])

  const promptReq = async (prompt: string): Promise<void> => {
    setLoading(true)
    try {
      const user = { role: 'user', content: prompt }
      setChat((preValue) => [...preValue, user])

      // Other way is to use axios, but could not figure out native streaming handling.
      // From what I could gather, axios does not use fetch in the background to make calls

      // const req = { model: modelName, messages: [...chat, user], stream: true }
      // const response = await axios.post('http://localhost:11434/api/chat', JSON.stringify(req), {
      //   responseType: 'stream'
      // })

      const response = await ollama.chat({
        model: modelName,
        messages: [...chat, user],
        stream: true
      })
      let chunk = ''

      for await (const part of response) {
        chunk += part.message.content
        if (part.done == true) {
          // break;          
          const ai = { role: 'assistant', content: chunk }
          addChat([...chat, user, ai]);            
          setChat((preValue) => [...preValue, ai])
          setStream('');
          break;
        }
        setStream(chunk)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      // At some point let's handle the errors through toasts
    }
  }
  return [isLoading, promptReq]
}
