import { useDb } from '@renderer/hooks/useDb'
import {
  chatAtom,
  darkModeAtom,
  experimentalSearchAtom,
  imageAttatchmentAtom,
  selectedChatIndexAtom,
  stopGeneratingAtom,
  streamingAtom
} from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { ComponentProps, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { Button } from '@renderer/ui/Button'
import { FaRegCircleStop } from 'react-icons/fa6'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import remarkGfm  from "remark-gfm"

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat, setChat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)
  const [stream] = useAtom(streamingAtom)
  const { getChat } = useDb()
  const scrollRef = useRef<HTMLDivElement>(null)
  const setStopGenerating = useSetAtom(stopGeneratingAtom)
  const darkMode = useAtomValue(darkModeAtom)
  const imageAttachment = useAtomValue(imageAttatchmentAtom)
  const experimentalSearch = useAtomValue(experimentalSearchAtom)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [stream, chat])

  function handleClick(): void {
    // to stop streaming on click
    setStopGenerating(true)
  }

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
              <Markdown
                className="markdown"
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => {
                    return (
                      <a
                        href={props.href}
                        className="bg-foreground bg-opacity-20 opacity-70 px-1 hover:opacity-100 hover:underline transition-all"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {props.children}
                      </a>
                    )
                  }
                }}
              >
                {val.content}
              </Markdown>
            </Card>
          )
        })}
      {stream && (
        <div className="flex flex-col gap-2">
          <Button
            variant="link"
            onClick={handleClick}
            className="flex justify-center items-center gap-1 text-sm self-start"
          >
            <FaRegCircleStop /> Stop generating
          </Button>
          <Card>{stream}</Card>
        </div>
      )}
      {chat.length > 0 &&
        chat[chat.length - 1].role == 'user' &&
        !stream &&
        (experimentalSearch || imageAttachment) && (
          <Card className="w-4/5">
            <Skeleton
              className="opacity-50"
              baseColor={darkMode ? '#FFFFFF' : '#202020'}
              highlightColor={darkMode ? '#bfbfbf' : ' #b3b3b3'}
              borderRadius={5}
              count={4}
            />
          </Card>
        )}
      <div ref={scrollRef}></div>
    </div>
  )
}
