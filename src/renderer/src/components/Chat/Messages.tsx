import { chatAtom, selectedChatIndexAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom } from 'jotai'
import { ComponentProps, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export const Messages = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [chat] = useAtom(chatAtom)
  const [selectedChatIndex] = useAtom(selectedChatIndexAtom)


  useEffect(()=>{
  // Update chatAtom, based on selectedText
  },[selectedChatIndex])

  
  return (
    <div
      className={twMerge('flex flex-col gap-5 items-start w-3/6 mb-5 overflow-y-auto', className)}
      {...props}
    >
      {chat.map((val, index) => {
        return (val.role == 'user' ? (
          <Card key={index} className="self-end bg-opacity-0 dark:bg-opacity-10">
            <h1 className="">{val.content}</h1>
          </Card>
        ) : (
          <Card key={index}>{val.content}</Card>
        ))
      })}
    </div>
  )
}
