import { useDb } from '@renderer/hooks/useDb'
import { chatAtom, selectedChatIndexAtom, streamingAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom } from 'jotai'
import { ComponentProps, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat, setChat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)
  const [stream] = useAtom(streamingAtom)
  const {getChat} = useDb()

  useEffect(()=>{
  // Update chatAtom, based on selectedText
    async function getApi():Promise<void>{
      const response = await getChat();
      setChat(response)
    }
    if(selectedChatIndex)getApi()
  },[selectedChatIndex])
  
  return (
    <div
      className={twMerge('flex flex-col gap-5 items-start w-3/6 mb-5 overflow-y-auto ', className)}
      {...props}
    >
      {chat && chat.map((val, index) => {
        return (val.role == 'user' ? (
          <Card key={index} className="self-end bg-opacity-0 dark:bg-opacity-10">
            <h1 className="">{val.content}</h1>
          </Card>
        ) : (
          <Card key={index}>{val.content}</Card>
        ))
      })}
      {stream && <Card>{stream}</Card>}
    </div>
  )
}
