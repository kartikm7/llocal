import { chatAtom, imageAttatchmentAtom, prefModelAtom, stopGeneratingAtom, streamingAtom } from '@renderer/store/mocks'
import { ollama } from '@renderer/utils/ollama'
// import axios from 'axios'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useDb } from './useDb'
import { toast } from 'sonner'


interface userContentType {
  role: string,
  content: string,
  images?: string[]
}

export function usePrompt(): [boolean, (prompt: string) => Promise<void>] {
  // Defining states
  const [isLoading, setLoading] = useState(false)
  const [chat, setChat] = useAtom(chatAtom)
  const [modelName] = useAtom(prefModelAtom)
  const setStream = useSetAtom(streamingAtom)
  const [stopGenerating, setStopGenerating] = useAtom(stopGeneratingAtom)
  const { addChat } = useDb()
  const stopGeneratingRef = useRef(stopGenerating)
  const [imageAttatchment, setImageAttachment] = useAtom(imageAttatchmentAtom)

  // To Debug
  // useEffect(()=>{console.log(stream);
  // },[stream])

  // To ensure, the state update works just right
  useEffect(() => {
    stopGeneratingRef.current = stopGenerating
  }, [stopGenerating])

  const promptReq = async (prompt: string): Promise<void> => {
    setLoading(true)
    try {


      let user:userContentType = { role: 'user', content: prompt }
      
      // this allows to have image attachments
      if(imageAttatchment){
        user  = {images:[imageAttatchment], ...user}
      }

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
        // incase stop generating is invoked as true, then we abort the process
        if (part.done == true || stopGeneratingRef.current) {
          // break;
          const ai = { role: 'assistant', content: chunk }
          addChat([...chat, user, ai])
          setChat((preValue) => [...preValue, ai])
          setStream('')
          setStopGenerating(false)
          ollama.abort()
          break
        }
        setStream(chunk)
      }
      setLoading(false)
      setImageAttachment('')
    } catch (error) {
      console.error(error)
      setLoading(false)
      setImageAttachment('')
      toast(`${error}`)
      // At some point let's handle the errors through toasts
    }
  }
  return [isLoading, promptReq]
}
