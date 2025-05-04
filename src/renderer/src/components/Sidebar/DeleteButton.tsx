import React, { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@renderer/ui/Button'
import { useDb } from '@renderer/hooks/useDb'
import { MdDeleteForever } from 'react-icons/md'
import { LuCheckCircle2, LuXCircle } from 'react-icons/lu'
import { toast } from 'sonner'
import { useSetAtom } from 'jotai'
import { knowledgeBaseAtom } from '@renderer/store/mocks'
import { t } from '@renderer/utils/utils'

interface DeleteButtonProps extends ComponentProps<'div'> {
  date?: string,
  path?: string,
  fileName?: string,
  type: "chat" | "knowledge"
}

export const DeleteButton = ({
  className,
  date = '',
  path = '',
  fileName = '',
  type,
  ...props
}: DeleteButtonProps): React.ReactElement => {
  const { deleteChat } = useDb()
  const [showOptions, setShowOptions] = useState(false)
  const setKnowledgeBase = useSetAtom(knowledgeBaseAtom)

  async function handleClick(del = false): Promise<void> {
    /*
    * this component, is shared between chatlist and the knowledge base,
    * so here we check whether the call is made from the chatlist component or knowledgeBase
    */
    if (del && type == 'chat') await deleteChat(date)
    if (del && type == 'knowledge') {
      try {
        await window.api.deleteVectorDb(path);
        setKnowledgeBase((pre) => pre.filter((val) => val.path != path)) // filtering the global state
        toast.success(t('fileDeleted', { fileName }))
      } catch (error) {
        toast.error(`${error}`)
      }
    }
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
              toast.info(t('fileNotDeleted', { type }))
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
            toast.warning(t("fileDeleteWarning", { type }))
          }}
        >
          <MdDeleteForever className={`block text-2xl`} />
        </Button>
      )}
    </div>
  )
}
