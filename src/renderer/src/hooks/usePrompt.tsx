import { chatAtom, modelNameAtom } from "@renderer/store/mocks"
import axios from "axios"
import { useAtom } from "jotai"
import { useState } from "react"

export async function usePrompt(prompt:string):Promise<[boolean]> {
  const [isLoading, setLoading] = useState(true);
  const user = {role: "user", content: prompt}
  const [chat,setChat] = useAtom(chatAtom)
  setChat((preValue)=> [...preValue, user]) 
  const [modelName] = useAtom(modelNameAtom)
  const req = {model: modelName, messages:chat, stream:true}
  try {
    const response = await axios.post('http://localhost:11434/api/chat', JSON.stringify(req))
    setChat((preValue)=> [...preValue, response.data.message])
    setLoading(false) 
  } catch (error) {
    setLoading(false) 
    // At some point let's handle the errors through toasts
  }
  return [isLoading]
}