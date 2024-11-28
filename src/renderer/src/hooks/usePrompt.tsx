import {
  chatAtom,
  experimentalSearchAtom,
  fileContextAtom,
  imageAttatchmentAtom,
  prefModelAtom,
  stopGeneratingAtom,
  streamingAtom,
  suggestionsAtom,
} from '@renderer/store/mocks'
import { ollama } from '@renderer/utils/ollama'
// import axios from 'axios'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useDb } from './useDb'
import { toast } from 'sonner'

// interface experimentalSearchType {
//   output: string,
//   sources: string[]
// }

interface userContentType {
  role: string
  content: string
  images?: string[]
}

// to extract urls from string
function findUrls(text: string): string[] {
  const urlPattern = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /(?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])?/gi
  );

  const urls = text.match(urlPattern) ?? [];
  return urls;
}



export function usePrompt(): [boolean, (prompt: string) => Promise<void>] {
  // Defining states
  const [isLoading, setLoading] = useState(false)
  const [chat, setChat] = useAtom(chatAtom)
  const [modelName] = useAtom(prefModelAtom)
  const setStream = useSetAtom(streamingAtom) // to handle streaming
  const [stopGenerating, setStopGenerating] = useAtom(stopGeneratingAtom) // to manage the stop generating button
  const { addChat } = useDb() // this is to add to the db
  const stopGeneratingRef = useRef(stopGenerating) // ref to handle the states correctly here, make sure the stop generating works
  const [imageAttatchment, setImageAttachment] = useAtom(imageAttatchmentAtom) // for images
  const [experimentalSearch, setExperimentalSearch] = useAtom(experimentalSearchAtom)
  const [file, setFile] = useAtom(fileContextAtom)
  const [suggestions, setSuggestions] = useAtom(suggestionsAtom)
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
      let user: userContentType = { role: 'user', content: prompt }
      const initialUser = user

      let sources = ''
      // this allows to have image attachments
      if (imageAttatchment) {
        user = { images: [imageAttatchment], ...user }
      }

      setChat((preValue) => [...preValue, user])

      // if the experimental search exists it will perform IPC invoke to the main functino and return the new prompt based on the search
      if (experimentalSearch) {
        // checking if the prompt contains urls
        const urls = findUrls(prompt);
        if (urls.length > 1) toast.warning('Multiple links detected, only the first one is scraped') // edge case where in there are multiple links, we only select the first one
        try {
          const searchResponse = await window.api.experimentalSearch(prompt, urls)
          user = { ...user, content: searchResponse.prompt }
          sources = searchResponse.sources
        } catch (error) {
          toast(`${error}`)
          setExperimentalSearch(false)
          return
        }
      }

      if (file.length > 0) {
        try {
          const searchResponse = await window.api.similaritySearch(file, prompt);
          user = { ...user, content: searchResponse.prompt }
          sources = searchResponse.sources
        } catch (error) {
          toast(`${error}`)
          setFile([])
          return
        }
      }

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
          // defining the ai assistant object which contains the response
          let ai = { role: 'assistant', content: chunk }
          // incase, sources exist we show the relevant citations aswell
          if (sources) {
            ai = { role: 'assistant', content: chunk + '\n' + sources }
          }
          addChat([...chat, initialUser, ai])
          setChat((preValue) => [...preValue, ai])
          setStream('')
          setStopGenerating(false)
          ollama.abort()
          break
        }
        setStream(chunk)
      }
      // incase suggestions are toggled on
      if (!suggestions.show) {
        console.log(chunk)
        // the JSON mode prompt
        const suggestionsPrompt = `You are a helpful AI agent, you need to output suggested follow up questions
based on the following context:\n ${chunk}
and you **NEED** to strictly follow the following output schema:
{suggestions: string[]}`
        // making the api call
        const suggestionsResponse = await ollama.generate({ prompt: suggestionsPrompt, stream: false, model: modelName, format: "json" })
        const prompts = JSON.parse(suggestionsResponse.response).suggestions
        // this check is actually not perfect since it only checks for an array and not explicity an array of strings
        if (Array.isArray(prompts)) setSuggestions((pre) => ({ ...pre, prompts: prompts }))
        else setSuggestions((pre) => ({ ...pre, prompts: [] })) // incase it's not an array we enforce a defualt value
      }
      // clearing states as required
      setExperimentalSearch(false)
      setLoading(false)
      setImageAttachment('')
    } catch (error) {
      console.error(error)
      setLoading(false)
      setImageAttachment('')
      // handling the error with toasts
      toast(`${error}`)
    }
  }
  return [isLoading, promptReq]
}
