import React, { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@renderer/ui/Button'
import { useDb } from '@renderer/hooks/useDb'
import { MdDeleteForever } from 'react-icons/md'
import { LuCheckCircle2, LuXCircle } from 'react-icons/lu'
import { toast } from 'sonner'

interface DeleteButtonProps extends ComponentProps<'div'> {
  date: string
}

export const DeleteButton = ({
  className,
  date,
  ...props
}: DeleteButtonProps): React.ReactElement => {
  const { deleteChat } = useDb()
  const [showOptions, setShowOptions] = useState(false)

  async function handleClick(del = false): Promise<void> {
    if (del) await deleteChat(date)
    setShowOptions((pre) => !pre)
  }

  return (
    <div className={twMerge('', className)} {...props}>
      {showOptions ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="icon"
            onClick={() => {
              toast.info('The chat was not deleted')
              handleClick()
            }}
          >
            <LuXCircle className={`text-2xl`} />
          </Button>
          <Button type="button" variant="icon" onClick={async () => handleClick(true)}>
            <LuCheckCircle2 className={`text-2xl`} />
          </Button>
        </div>
      ) : (
        <Button
          className={``}
          type="button"
          variant="icon"
          onClick={() => {
            handleClick()
            toast.warning('Once the chat is deleted, it is deleted forever!')
          }}
        >
          <MdDeleteForever className={`block text-2xl`} />
        </Button>
      )}
    </div>
  )
}
