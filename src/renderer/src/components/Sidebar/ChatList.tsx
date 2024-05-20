import { Card } from '@renderer/ui/Card'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { getDbReturn, useDb } from '@renderer/hooks/useDb'
import { useAtom } from 'jotai'
import { selectedChatIndexAtom } from '@renderer/store/mocks'

export const ChatList = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const { getMessageList } = useDb()
  const [selectedChatIndex, setSelectedChatIndex] = useAtom(selectedChatIndexAtom)
  const [chatList, setChatList] = useState<getDbReturn[]>([])
  // useEffect(()=>{console.log(chatList);
  // },[chatList])
  useEffect(() => {
    async function getList(): Promise<void> {
      const response = await getMessageList()
      // console.log("Message List", response);
      setChatList(response)
    }
     getList()
  }, [selectedChatIndex])

  async function handleClick(date:string):Promise<void>{
    // const response = await updateDate(date);
    setSelectedChatIndex(date)
  }


  return (
    <div className={twMerge('flex flex-col gap-2 overflow-auto', className)} {...props}>
      {chatList.map((val) => {
        return <Card key={val.date} onClick={()=>handleClick(val.date)} className={`cursor-pointer ${selectedChatIndex===val.date ? "opacity-100" :  "opacity-50"} hover:opacity-100 transition-opacity` }>
          <h1 className={"line-clamp-1"}>{val.chat[0].content}</h1>
        </Card>
      })}
    </div>
  )
}
