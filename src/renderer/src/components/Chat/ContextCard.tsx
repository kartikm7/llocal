import { fileContextAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { cn } from '@renderer/utils/utils'
import { useAtom } from 'jotai'
import React, { ComponentProps } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { PiBookBookmarkBold } from 'react-icons/pi'
import { toast } from 'sonner'

export const ContextCard = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [file, setFile] = useAtom(fileContextAtom)
  function handleClick(): void {
    setFile([])
    toast.info(`The context has been cleared!`)
  }
  return (
    <>
      {file.length > 0 && <Card className={cn(className, "flex justify-center items-center gap-2 p-2 px-3 text-sm")} {...props}>
        <PiBookBookmarkBold className='text-2xl' />
        Knowledge Base
        <IoIosCloseCircle className="text-2xl opacity-50 hover:opacity-100 cursor-pointer" onClick={handleClick} />
      </Card>}
    </>
  )
}
