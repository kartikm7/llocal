import { Card } from '@renderer/ui/Card'
import Logo from '../../assets/logo.png'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useAtomValue, useSetAtom } from 'jotai'
import { chatAtom, selectedChatIndexAtom, streamingAtom, suggestionsAtom } from '@renderer/store/mocks'
import { t } from '@renderer/utils/utils'

export const NewChat = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const setChat = useSetAtom(chatAtom)
  const setSelectedChatIndex = useSetAtom(selectedChatIndexAtom)
  const stream = useAtomValue(streamingAtom)
  const setSuggestions = useSetAtom(suggestionsAtom)
  function handleClick(): void {
    if (!stream) {
      setSelectedChatIndex('')
      setChat([])
      setSuggestions(pre => ({ ...pre, prompts: [] }))
    }
  }

  return (
    <div onClick={handleClick} className={twMerge('', className)} {...props}>
      <Card className="flex items-center gap-3 p-3 bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-50 transition-opacity cursor-pointer">
        <img src={Logo} alt="" className="size-12 dark:invert" />
        <h1>{t("Start a chat")}</h1>
      </Card>
    </div>
  )
}
