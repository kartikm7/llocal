import { useDb } from '@renderer/hooks/useDb'
import { chatAtom, selectedChatIndexAtom, streamingAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom } from 'jotai'
import React, { ComponentProps, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat, setChat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)
  const [stream] = useAtom(streamingAtom)
  const { getChat } = useDb()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [stream, chat])

  useEffect(() => {
    // Update chatAtom, based on selectedText
    async function getApi(): Promise<void> {
      const response = await getChat()
      setChat(response)
    }
    if (selectedChatIndex) {
      getApi()
    }
  }, [selectedChatIndex])

  return (
    <div
      className={twMerge('flex flex-col gap-5 items-start w-3/6 mb-5 overflow-y-auto ', className)}
      {...props}
    >
      {chat &&
        chat.map((val, index) => {
          return val.role == 'user' ? (
            <Card key={index} className="self-end bg-opacity-10 dark:bg-opacity-10">
              <h1 className="">{val.content}</h1>
            </Card>
          ) : (
            <Card key={index}>
                <Markdown className="markdown" rehypePlugins={[rehypeHighlight]} >{val.content}</Markdown>
            </Card>
          )
        })}
      {stream && <Card>{stream}</Card>}
      <div ref={scrollRef}></div>
    </div>
  )
}
