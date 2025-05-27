import { useDb } from '@renderer/hooks/useDb'
import {
  chatAtom,
  selectedChatIndexAtom,
} from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom } from 'jotai'
import React, { ComponentProps, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import 'react-loading-skeleton/dist/skeleton.css'
import { AiMessage } from '@renderer/ui/Message'
import { StreamingMessage } from './Messages/StreamingMessage'

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat, setChat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)
  const { getChat } = useDb()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  useEffect(() => {
    // Update chatAtom, based on selectedText
    async function getApi(): Promise<void> {
      const response = await getChat()
      setChat(response)
    }
    if (selectedChatIndex) {
      getApi()
    } else {
      setChat([]) // this required because when the chat is deleted then the state also must clear
    }
  }, [selectedChatIndex])

  return (
    <div
      className={twMerge('flex flex-col gap-5 w-1/3 mb-5 overflow-y-auto', className)}
      {...props}
    >
      {chat &&
        chat.map((val, index) => {
          // console.log(val.content)

          return val.role == 'user' ? (
            <Card key={index} className="self-end bg-opacity-10 whitespace-pre-line dark:bg-opacity-10 ">
              <p className="break-words">{val.content}</p>
            </Card>
          ) : <AiMessage key={index} message={val.content} />
        })}
      <StreamingMessage />
      <div ref={scrollRef}></div>
    </div>
  )
}
