import { fileContextAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { cn } from '@renderer/utils/utils'
import { useAtom } from 'jotai'
import React, { useEffect, ComponentProps } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { toast } from 'sonner'

export const ContextCard = ({className, ...props}:ComponentProps<'div'>): React.ReactElement => {
  const [file, setFile] = useAtom(fileContextAtom)
  function handleClick(): void {
    setFile({path:"", fileName:""})
    toast.info(`The context has been cleared!`)
  }
  useEffect(() => {}, [file]) // to force component life-cycle
  return (
    <>
        {file.path && <Card className={cn(className,"flex justify-center items-center gap-2 p-2 px-3 text-sm")} {...props}>
        {file.fileName}
        <IoIosCloseCircle className="text-2xl opacity-50 hover:opacity-100 cursor-pointer" onClick={handleClick} />
      </Card>}
    </>
  )
}
