import { useDb } from '@renderer/hooks/useDb'
import {
  chatAtom,
  darkModeAtom,
  experimentalSearchAtom,
  imageAttatchmentAtom,
  selectedChatIndexAtom,
  streamingAtom,
  // suggestionsAtom
} from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom, useAtomValue } from 'jotai'
import React, { ComponentProps, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Suggestions from './suggestions'
import { AiMessage } from '@renderer/ui/Message'

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat, setChat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)
  const [stream] = useAtom(streamingAtom)
  const { getChat } = useDb()
  const scrollRef = useRef<HTMLDivElement>(null)
  const darkMode = useAtomValue(darkModeAtom)
  const imageAttachment = useAtomValue(imageAttatchmentAtom)
  const experimentalSearch = useAtomValue(experimentalSearchAtom)
  // const suggestions = useAtomValue(suggestionsAtom)

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
    } else {
      setChat([]) // this required because when the chat is deleted then the state also must clear
    }
  }, [selectedChatIndex])

  return (
    <div
      className={twMerge('flex flex-col gap-5 items-start w-3/6 mb-5 overflow-y-auto ', className)}
      {...props}
    >
      {chat &&
        chat.map((val, index) => {
          // console.log(val.content)

          return val.role == 'user' ? (
            <Card key={index} className="self-end bg-opacity-10 whitespace-pre-line dark:bg-opacity-10">
              <h1 className="">{val.content}</h1>
            </Card>
          ) : <AiMessage key={index} message={val.content} />
        })}
      {stream && (
        <div className="flex flex-col gap-2">
          <AiMessage message={stream} stream={!!stream} />
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
      {!stream && <Suggestions />}
      <div ref={scrollRef}></div>
    </div>
  )
}
